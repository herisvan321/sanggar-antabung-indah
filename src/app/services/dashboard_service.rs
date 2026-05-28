/* ---------------------------------------------------------
 * 📑 LABEL: DashboardService (services/dashboard_service.rs)
 * --------------------------------------------------------- */

use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::serde_json::{json, Value};
use rustbasic_core::database::DB;
use rustbasic_core::chrono::{Datelike, Timelike};
use std::collections::BTreeMap;
use crate::app::models::{users, activity_log};

pub struct DashboardService {
    db: AnyPool,
}

impl DashboardService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_dashboard_data(&self, period_str: Option<&str>) -> Value {
        let period = ActivityPeriod::from(period_str);
        let period_start = period.start_at();
        
        let total_users = DB::table(&self.db, "users").count().await.unwrap_or(0);
        let total_activity_logs = count_relevant_activity_logs(&self.db).await;
        
        // Fetch activity logs using ORM QueryBuilder
        let start_str = period_start.format("%Y-%m-%d %H:%M:%S").to_string();
        println!("DEBUG: period_start = {}", start_str);
        
        let all_logs_debug = DB::table(&self.db, "activity_log")
            .order_by("created_at", "DESC")
            .limit(5)
            .get::<activity_log::Model>()
            .await
            .unwrap_or_default();
        println!("DEBUG: total logs in table = {}", total_activity_logs);
        for (i, log) in all_logs_debug.iter().enumerate() {
            println!("DEBUG log[{}]: id={}, created_at={:?}", i, log.id, log.created_at);
        }

        let raw_logs = DB::table(&self.db, "activity_log")
            .where_op("created_at", ">=", start_str)
            .order_by("created_at", "DESC")
            .limit(1000)
            .get::<activity_log::Model>()
            .await
            .unwrap_or_default();
        println!("DEBUG: filtered raw_logs count = {}", raw_logs.len());

        // Fetch users using ORM QueryBuilder to map causer names in-memory
        let all_users = DB::table(&self.db, "users")
            .get::<users::Model>()
            .await
            .unwrap_or_default();

        let user_map: std::collections::HashMap<i32, String> = all_users
            .into_iter()
            .map(|u| (u.id, u.name))
            .collect();

        let logs: Vec<DashboardActivityLog> = raw_logs
            .into_iter()
            .map(|log| {
                let causer_name = if log.causer_type.as_deref() == Some("users") {
                    log.causer_id.and_then(|id| user_map.get(&id).cloned())
                } else {
                    None
                };

                DashboardActivityLog {
                    id: log.id as i64,
                    log_name: log.log_name,
                    description: log.description.unwrap_or_default(),
                    subject_type: log.subject_type,
                    subject_id: log.subject_id,
                    causer_type: log.causer_type,
                    causer_id: log.causer_id,
                    properties: log.properties,
                    created_at: log.created_at.unwrap_or_default(),
                    causer_name,
                }
            })
            .collect();

        let activity_chart = build_activity_chart(&logs, period);
        let activity_donut = build_activity_donut(&logs);

        let formatted_logs: Vec<Value> = logs
            .iter()
            .map(|log| {
                let properties = parse_properties(log.properties.as_deref());

                json!({
                    "id": log.id,
                    "logName": log.log_name.clone().unwrap_or_else(|| "default".to_string()),
                    "description": activity_description(log, &properties),
                    "subject": format_subject(log.subject_type.as_deref(), log.subject_id),
                    "causer": if let Some(ref name) = log.causer_name {
                        if !name.trim().is_empty() {
                            name.clone()
                        } else {
                            format_subject(log.causer_type.as_deref(), log.causer_id)
                        }
                    } else {
                        format_subject(log.causer_type.as_deref(), log.causer_id)
                    },
                    "status": properties.get("status").and_then(|value| value.as_i64()),
                    "durationMs": properties.get("duration_ms").and_then(|value| value.as_i64()),
                    "properties": properties,
                    "createdAt": log.created_at,
                })
            })
            .collect();

        json!({
            "totalUsers": total_users,
            "totalActivityLogs": total_activity_logs,
            "activityPeriod": period.as_str(),
            "activityChart": activity_chart,
            "activityDonut": activity_donut,
            "activityLogs": formatted_logs,
        })
    }
}

async fn count_relevant_activity_logs(db: &AnyPool) -> i64 {
    DB::table(db, "activity_log")
        .count()
        .await
        .unwrap_or(0)
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum ActivityPeriod {
    Today,
    Week,
    Month,
    Year,
}

impl ActivityPeriod {
    fn from(value: Option<&str>) -> Self {
        match value {
            Some("week") => Self::Week,
            Some("month") => Self::Month,
            Some("year") => Self::Year,
            _ => Self::Today,
        }
    }

    fn as_str(&self) -> &'static str {
        match self {
            Self::Today => "today",
            Self::Week => "week",
            Self::Month => "month",
            Self::Year => "year",
        }
    }

    fn start_at(&self) -> rustbasic_core::chrono::NaiveDateTime {
        let now = rustbasic_core::chrono::Local::now().naive_local();
        let today = now.date();

        match self {
            Self::Today => today.and_hms_opt(0, 0, 0).unwrap_or(now),
            Self::Week => {
                let start = today - rustbasic_core::chrono::Duration::days(today.weekday().num_days_from_monday() as i64);
                start.and_hms_opt(0, 0, 0).unwrap_or(now)
            }
            Self::Month => today.with_day(1).unwrap_or(today).and_hms_opt(0, 0, 0).unwrap_or(now),
            Self::Year => today.with_month(1).and_then(|date| date.with_day(1)).unwrap_or(today).and_hms_opt(0, 0, 0).unwrap_or(now),
        }
    }
}

#[derive(Clone, Debug)]
struct DashboardActivityLog {
    id: i64,
    log_name: Option<String>,
    description: String,
    subject_type: Option<String>,
    subject_id: Option<i32>,
    causer_type: Option<String>,
    causer_id: Option<i32>,
    properties: Option<String>,
    created_at: String,
    causer_name: Option<String>,
}

fn build_activity_chart(
    logs: &[DashboardActivityLog],
    period: ActivityPeriod,
) -> Vec<Value> {
    match period {
        ActivityPeriod::Today => build_today_chart(logs),
        ActivityPeriod::Week => build_day_chart(logs, 7),
        ActivityPeriod::Month => build_month_chart(logs),
        ActivityPeriod::Year => build_year_chart(logs),
    }
}

fn build_today_chart(logs: &[DashboardActivityLog]) -> Vec<Value> {
    let mut counts = BTreeMap::new();
    for start_hour in (0..24).step_by(3) {
        counts.insert(start_hour, 0_i64);
    }

    for log in logs {
        if let Some(date_time) = parse_log_datetime(Some(&log.created_at)) {
            let bucket = (date_time.hour() / 3) * 3;
            if let Some(count) = counts.get_mut(&bucket) {
                *count += 1;
            }
        }
    }

    counts
        .iter()
        .map(|(hour, count)| json!({
            "label": format!("{:02}:00", hour),
            "count": count,
        }))
        .collect()
}

fn build_day_chart(
    logs: &[DashboardActivityLog],
    days: i64,
) -> Vec<Value> {
    let start = rustbasic_core::chrono::Local::now().date_naive()
        - rustbasic_core::chrono::Duration::days(days - 1);
    let mut counts = BTreeMap::new();

    for offset in 0..days {
        let day = start + rustbasic_core::chrono::Duration::days(offset);
        counts.insert(day, 0_i64);
    }

    for log in logs {
        if let Some(day) = parse_log_date(Some(&log.created_at)) {
            if let Some(count) = counts.get_mut(&day) {
                *count += 1;
            }
        }
    }

    counts
        .iter()
        .map(|(day, count)| json!({
            "label": day.format("%d/%m").to_string(),
            "count": count,
        }))
        .collect()
}

fn build_month_chart(logs: &[DashboardActivityLog]) -> Vec<Value> {
    let today = rustbasic_core::chrono::Local::now().date_naive();
    let mut counts = BTreeMap::new();

    for day in 1..=today.day() {
        if let Some(date) = today.with_day(day) {
            counts.insert(date, 0_i64);
        }
    }

    for log in logs {
        if let Some(day) = parse_log_date(Some(&log.created_at)) {
            if let Some(count) = counts.get_mut(&day) {
                *count += 1;
            }
        }
    }

    counts
        .iter()
        .map(|(day, count)| json!({
            "label": day.format("%d").to_string(),
            "count": count,
        }))
        .collect()
}

fn build_year_chart(logs: &[DashboardActivityLog]) -> Vec<Value> {
    let today = rustbasic_core::chrono::Local::now().date_naive();
    let mut counts = BTreeMap::new();

    for month in 1..=today.month() {
        counts.insert(month, 0_i64);
    }

    for log in logs {
        if let Some(date_time) = parse_log_datetime(Some(&log.created_at)) {
            if let Some(count) = counts.get_mut(&date_time.month()) {
                *count += 1;
            }
        }
    }

    counts
        .iter()
        .map(|(month, count)| {
            let label = rustbasic_core::chrono::NaiveDate::from_ymd_opt(today.year(), *month, 1)
                .map(|date| date.format("%b").to_string())
                .unwrap_or_else(|| month.to_string());

            json!({
                "label": label,
                "count": count,
            })
        })
        .collect()
}

fn build_activity_donut(logs: &[DashboardActivityLog]) -> Vec<Value> {
    let mut counts = BTreeMap::new();

    for log in logs {
        let label = log.log_name.as_deref().unwrap_or("default").to_string();
        *counts.entry(label).or_insert(0_i64) += 1;
    }

    counts
        .iter()
        .map(|(label, count)| json!({
            "label": label,
            "count": count,
        }))
        .collect()
}

fn parse_properties(value: Option<&str>) -> Value {
    value
        .and_then(|value| rustbasic_core::serde_json::from_str::<Value>(value).ok())
        .unwrap_or_else(|| json!({}))
}

fn activity_description(
    log: &DashboardActivityLog,
    properties: &Value,
) -> String {
    if !log.description.trim().is_empty() {
        return log.description.clone();
    }

    match (
        properties.get("method").and_then(|value| value.as_str()),
        properties.get("uri").and_then(|value| value.as_str()),
    ) {
        (Some(method), Some(uri)) => format!("{} {}", method, uri),
        _ => "-".to_string(),
    }
}

fn parse_log_datetime(value: Option<&str>) -> Option<rustbasic_core::chrono::NaiveDateTime> {
    let value = value?;
    let normalized = value.replace('T', " ").replace('Z', "");
    let without_fraction = normalized.split('.').next().unwrap_or(&normalized);

    rustbasic_core::chrono::NaiveDateTime::parse_from_str(without_fraction, "%Y-%m-%d %H:%M:%S")
        .or_else(|_| rustbasic_core::chrono::NaiveDateTime::parse_from_str(without_fraction, "%Y-%m-%d %H:%M:%S%.f"))
        .ok()
}

fn parse_log_date(value: Option<&str>) -> Option<rustbasic_core::chrono::NaiveDate> {
    parse_log_datetime(value)
        .map(|date_time| date_time.date())
        .or_else(|| value.and_then(|date| rustbasic_core::chrono::NaiveDate::parse_from_str(date, "%Y-%m-%d").ok()))
}

fn format_subject(subject_type: Option<&str>, subject_id: Option<i32>) -> String {
    match (subject_type, subject_id) {
        (Some(subject_type), Some(subject_id)) => format!("{} #{}", subject_type, subject_id),
        (Some(subject_type), None) => subject_type.to_string(),
        _ => "-".to_string(),
    }
}
