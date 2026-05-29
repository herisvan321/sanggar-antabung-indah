use crate::app::models::sop_rule;
use crate::app::observers::sop_rule_observer::{SopRuleObserver, SopRuleObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct SopRuleService {
    db: AnyPool,
}

impl SopRuleService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_rules(&self) -> Result<Vec<sop_rule::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "sop_rules")
            .order_by("id", "asc")
            .get::<sop_rule::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_rules_by_category(&self, category: &str) -> Result<Vec<sop_rule::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "sop_rules")
            .where_("category", category)
            .order_by("id", "asc")
            .get::<sop_rule::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_rule_by_id(&self, id: i32) -> Result<Option<sop_rule::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "sop_rules")
            .where_("id", id)
            .first::<sop_rule::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_rule(
        &self,
        icon: String,
        text: String,
        category: String,
    ) -> Result<sop_rule::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "icon": icon,
            "text": text,
            "category": category,
        });
        SopRuleObserverImpl::creating(&mut data);
        let item = sop_rule::Model::create(&self.db, data).await?;
        SopRuleObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_rule(
        &self,
        id: i32,
        icon: String,
        text: String,
        category: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "icon": icon,
            "text": text,
            "category": category,
        });
        SopRuleObserverImpl::updating(&mut data);
        DB::table(&self.db, "sop_rules")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_rule_by_id(id).await? {
            SopRuleObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_rule(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        SopRuleObserverImpl::deleting(id);
        DB::table(&self.db, "sop_rules")
            .where_("id", id)
            .delete()
            .await?;
        SopRuleObserverImpl::deleted(id);
        Ok(())
    }
}
