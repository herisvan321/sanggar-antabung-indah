use crate::app::models::booking_package;
use crate::app::observers::booking_package_observer::{BookingPackageObserver, BookingPackageObserverImpl};
use rustbasic_core::sqlx::AnyPool;
use rustbasic_core::database::DB;
use rustbasic_core::serde_json::json;

pub struct BookingPackageService {
    db: AnyPool,
}

impl BookingPackageService {
    pub fn new(db: AnyPool) -> Self {
        Self { db }
    }

    pub async fn get_all_packages(&self) -> Result<Vec<booking_package::Model>, rustbasic_core::sqlx::Error> {
        let items = DB::table(&self.db, "booking_packages")
            .order_by("id", "asc")
            .get::<booking_package::Model>()
            .await?;
        Ok(items)
    }

    pub async fn get_package_by_id(&self, id: i32) -> Result<Option<booking_package::Model>, rustbasic_core::sqlx::Error> {
        let item = DB::table(&self.db, "booking_packages")
            .where_("id", id)
            .first::<booking_package::Model>()
            .await?;
        Ok(item)
    }

    pub async fn create_package(
        &self,
        name: String,
        description: String,
    ) -> Result<booking_package::Model, rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "name": name,
            "description": description,
        });
        BookingPackageObserverImpl::creating(&mut data);
        let item = booking_package::Model::create(&self.db, data).await?;
        BookingPackageObserverImpl::created(&item);
        Ok(item)
    }

    pub async fn update_package(
        &self,
        id: i32,
        name: String,
        description: String,
    ) -> Result<(), rustbasic_core::sqlx::Error> {
        let mut data = json!({
            "name": name,
            "description": description,
        });
        BookingPackageObserverImpl::updating(&mut data);
        DB::table(&self.db, "booking_packages")
            .where_("id", id)
            .update(data)
            .await?;
        
        if let Some(item) = self.get_package_by_id(id).await? {
            BookingPackageObserverImpl::updated(&item);
        }
        Ok(())
    }

    pub async fn delete_package(&self, id: i32) -> Result<(), rustbasic_core::sqlx::Error> {
        BookingPackageObserverImpl::deleting(id);
        DB::table(&self.db, "booking_packages")
            .where_("id", id)
            .delete()
            .await?;
        BookingPackageObserverImpl::deleted(id);
        Ok(())
    }
}
