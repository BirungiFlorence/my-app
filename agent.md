# Agent Blueprint: Ironwood Prison Information Management System (PIMS) for Android

> **Purpose**: This `agent.md` document is a complete, self-contained, end-to-end specification for an AI agent or software engineer to bootstrap, construct, compile, and run the **Ironwood Prison Information Management System (PIMS)** as a native Android Studio application using **Kotlin**, **Jetpack Compose (Material 3)**, **Coroutines/Flow**, and **Room Database**.

---

## 1. Project Overview & Architecture

### Target Specs
- **Application Name**: Ironwood PIMS (Prison Information Management System)
- **Package Name**: `com.ironwood.pims`
- **Target OS**: Android 8.0 (API Level 26) through Android 15 (API Level 35)
- **Language**: Kotlin 2.0+
- **UI Toolkit**: Jetpack Compose with Material Design 3 (`androidx.compose.material3`)
- **Architecture Pattern**: MVVM (Model-View-ViewModel) + Single Source of Truth Repository Pattern + Room Database
- **Persistence**: Room Database with pre-seeded correctional facility data and TypeConverters for complex objects (Charges, Biometrics, Verifications).

### Key Functional Domains Covered
1. **Operations Command Center (Dashboard)**: Facility census vs operational capacity (1200 beds), live muster completion meter, restrictive segregation count, open security incidents, housing block occupancy cards, and quick command action shortcuts.
2. **Inmate Master Custody Roster**: Live searchable directory (Search by name, Inmate ID, Booking #, Penal code, Cell) and multi-axis filtering (Security Tier: Minimum, Medium, Maximum, Supermax; Custody Status; Housing Block).
3. **Inmate Master Custody Dossier**: Multi-tab bottom sheet/dialog detailing biometrics, scars/marks/tattoos, DNA/fingerprint verification, active penal charges with felony classifications, trust accounts, parole eligibility dates, and cell assignment history.
4. **4-Step Intake & Booking Wizard**: Step 1: Demographics & aliases; Step 2: Penal charges & jurisdiction; Step 3: Biometrics & AFIS; Step 4: Security tier classification, suicide watch triage & cell allocation.
5. **Muster & Headcount Roll Call**: Scheduled muster shifts (06:00, 12:00, 18:00, 22:00), per-inmate visual check, whole-block batch verification, emergency unaccounted inmate escalation, and watch commander sign-off certification.
6. **Cell & Housing Unit Matrix**: Visual tier-and-cell architecture for Block A (Minimum), Block B (Medium), Block C (Maximum), Block D (Segregation), and Ward M (Infirmary) with bed occupancy indicators and inter-unit transfers with security class compatibility validation.
7. **Security Incidents & Disciplinary Adjudication**: Infraction logging (Altercations, Contraband Seizures, Insubordination, Escape attempts) with evidence cataloging and disciplinary hearing adjudication to impose sanctions.
8. **Visitor Access Control & Checkpoints**: Inmate visitation scheduling, government photo ID validation, contraband screening clearance, visiting booth assignment, and check-in/checkout tracking.
9. **Infirmary & Medication Administration Record (MAR)**: Daily pill pass queue, nurse administration logging, vitals confirmation, and physician prescription orders.
10. **Correctional Guard Shift Roster**: Post assignments (Watchtowers, Sallyports, Segregation Tiers, Clinic), tactical radio frequencies, and on-duty status toggles.
11. **Facility Emergency Security Protocols (Lockdown)**: Instant security posture switcher (`Normal Operations`, `Elevated Precaution`, `Cellblock Lockdown`, `Facility Full Lockdown`) with security directive broadcast and logging.
12. **Printable / Exportable Official Booking Jacket**: Formatted correctional custody record with state letterhead, booking photo placeholder/mugshot, charge commitment breakdown, and signoff blocks for PDF export or printing.

---

## 2. Directory & Package Structure

```
IronwoodPIMS/
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── build.gradle.kts
├── settings.gradle.kts
└── app/
    ├── build.gradle.kts
    └── src/
        └── main/
            ├── AndroidManifest.xml
            ├── res/
            │   ├── values/
            │   │   ├── colors.xml
            │   │   ├── strings.xml
            │   │   └── themes.xml
            │   └── drawable/
            │       └── ic_launcher_foreground.xml
            └── java/com/ironwood/pims/
                ├── PimsApplication.kt
                ├── MainActivity.kt
                ├── data/
                │   ├── model/
                │   │   ├── PrisonModels.kt
                │   │   └── Converters.kt
                │   ├── local/
                │   │   ├── PimsDatabase.kt
                │   │   └── PimsDao.kt
                │   ├── repository/
                │   │   ├── PrisonRepository.kt
                │   │   └── PrisonRepositoryImpl.kt
                │   └── seed/
                │       └── MockData.kt
                ├── ui/
                │   ├── theme/
                │   │   ├── Color.kt
                │   │   ├── Theme.kt
                │   │   └── Type.kt
                │   ├── viewmodel/
                │   │   ├── PrisonViewModel.kt
                │   │   └── PrisonViewModelFactory.kt
                │   ├── components/
                │   │   ├── TopCommandBar.kt
                │   │   ├── NavigationItems.kt
                │   │   └── CommonBadges.kt
                │   ├── screens/
                │   │   ├── DashboardScreen.kt
                │   │   ├── InmatesRosterScreen.kt
                │   │   ├── HeadcountScreen.kt
                │   │   ├── HousingMapScreen.kt
                │   │   ├── IncidentsScreen.kt
                │   │   ├── VisitorsScreen.kt
                │   │   ├── MedicalWardScreen.kt
                │   │   └── StaffRosterScreen.kt
                │   └── dialogs/
                │       ├── InmateDossierDialog.kt
                │       ├── BookingIntakeDialog.kt
                │       ├── CellTransferDialog.kt
                │       ├── NewIncidentDialog.kt
                │       ├── AdjudicationDialog.kt
                │       ├── ScheduleVisitDialog.kt
                │       ├── AddMedicationDialog.kt
                │       ├── LockdownDialog.kt
                │       └── PrintJacketDialog.kt
```

---

## 3. Gradle Configuration Files

### `settings.gradle.kts`
```kotlin
pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "IronwoodPIMS"
include(":app")
```

### Root `build.gradle.kts`
```kotlin
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
```

### `app/build.gradle.kts`
```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.ironwood.pims"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.ironwood.pims"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")

    // Jetpack Compose & Material 3
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.8.4")

    // Room Database & Coroutines
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // JSON serialization for Room TypeConverters
    implementation("com.google.code.gson:gson:2.11.0")

    // Image loading
    implementation("io.coil-kt:coil-compose:2.7.0")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
```

---

## 4. Android Manifest & Resources

### `app/src/main/AndroidManifest.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:name=".PimsApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.IronwoodPIMS">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.IronwoodPIMS">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

### `app/src/main/res/values/strings.xml`
```xml
<resources>
    <string name="app_name">Ironwood PIMS</string>
</resources>
```

### `app/src/main/res/values/themes.xml`
```xml
<resources>
    <style name="Theme.IronwoodPIMS" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#090D16</item>
        <item name="android:windowBackground">#030712</item>
    </style>
</resources>
```

---

## 5. Domain Models & Type Converters

### `app/src/main/java/com/ironwood/pims/data/model/PrisonModels.kt`
```kotlin
package com.ironwood.pims.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

enum class SecurityLevel { Minimum, Medium, Maximum, Supermax }

enum class CustodyStatus {
    InCustody,
    SolitaryConfinement,
    MedicalWard,
    CourtTransit,
    WorkDetail,
    Released
}

enum class HousingBlockCode { BlockA, BlockB, BlockC, BlockD, WardM }

data class ChargeRecord(
    val code: String,
    val title: String,
    val felonyClass: String, // "Class A", "Class B", "Class C", "Misdemeanor"
    val sentenceYears: Double,
    val convictionDate: String,
    val courtJurisdiction: String
)

data class BiometricRecord(
    val height: String,
    val weight: String,
    val eyeColor: String,
    val hairColor: String,
    val scarsAndTattoos: String,
    val bloodType: String,
    val fingerprintsOnFile: Boolean = true,
    val dnaSampleCollected: Boolean = true
)

data class EmergencyContact(
    val name: String,
    val relationship: String,
    val phone: String
)

@Entity(tableName = "inmates")
data class Inmate(
    @PrimaryKey val id: String, // e.g. "INM-84920"
    val bookingNumber: String,
    val stateIdNumber: String,
    val firstName: String,
    val middleName: String? = null,
    val lastName: String,
    val aliases: List<String> = emptyList(),
    val dateOfBirth: String,
    val gender: String, // "Male", "Female"
    val photoUrl: String = "",
    val securityLevel: SecurityLevel,
    val custodyStatus: CustodyStatus,
    val cellBlock: HousingBlockCode,
    val cellNumber: String, // e.g. "C-102"
    val bunk: String, // "Lower", "Upper", "Single"
    val admissionDate: String,
    val projectedReleaseDate: String,
    val paroleEligibilityDate: String,
    val primaryOffense: String,
    val charges: List<ChargeRecord> = emptyList(),
    val bailAmount: Double = 0.0,
    val bailEligible: Boolean = false,
    val biometrics: BiometricRecord,
    val medicalAlerts: List<String> = emptyList(),
    val suicideWatch: Boolean = false,
    val gangAffiliation: String = "None Reported",
    val trustAccountBalance: Double = 0.0,
    val workDetail: String? = null,
    val emergencyContact: EmergencyContact,
    val assignedOfficer: String = "Watch Officer",
    val notes: String = ""
)

data class CellRecord(
    val cellNumber: String,
    val capacity: Int,
    val occupiedBy: List<String> = emptyList(),
    val tier: Int = 1,
    val status: String = "Operational" // Operational, Maintenance, Sanitary Quarantine
)

@Entity(tableName = "housing_blocks")
data class HousingBlock(
    @PrimaryKey val id: String,
    val code: HousingBlockCode,
    val name: String,
    val securityTier: String,
    val totalCells: Int,
    val capacity: Int,
    val cells: List<CellRecord> = emptyList()
)

data class InmateVerification(
    val inmateId: String,
    val inmateName: String,
    val cellBlock: HousingBlockCode,
    val cellNumber: String,
    val status: CustodyStatus,
    val verified: Boolean = false,
    val verifiedAt: String? = null,
    val verifiedBy: String? = null,
    val flaggedUnaccounted: Boolean = false,
    val notes: String? = null
)

@Entity(tableName = "headcounts")
data class HeadcountRoll(
    @PrimaryKey val id: String,
    val shift: String, // "Morning Muster (06:00)", etc.
    val countDate: String,
    val scheduledTime: String,
    val status: String, // "In Progress", "Reconciled", "Emergency Discrepancy"
    val censusTarget: Int,
    val verifiedTotal: Int,
    val unaccountedCount: Int,
    val conductedByOfficer: String,
    val certifyingSupervisor: String,
    val completedAt: String? = null,
    val inmateVerifications: List<InmateVerification> = emptyList()
)

data class InvolvedInmate(
    val inmateId: String,
    val inmateName: String,
    val role: String // "Aggressor", "Victim", "Participant", "Witness"
)

@Entity(tableName = "incidents")
data class IncidentReport(
    @PrimaryKey val id: String,
    val incidentNumber: String,
    val timestamp: String,
    val location: String,
    val cellBlock: HousingBlockCode? = null,
    val category: String, // "Physical Altercation", "Contraband Seizure", etc.
    val severity: String, // "Low", "Medium", "Critical"
    val involvedInmates: List<InvolvedInmate> = emptyList(),
    val reportingOfficer: String,
    val badgeNumber: String,
    val summary: String,
    val evidenceItems: List<String> = emptyList(),
    val disciplinaryStatus: String, // "Under Investigation", "Hearing Scheduled", "Sanctions Imposed", "Dismissed"
    val sanctionsApplied: String? = null
)

@Entity(tableName = "visitors")
data class VisitorRecord(
    @PrimaryKey val id: String,
    val visitorName: String,
    val idDocumentType: String,
    val idNumber: String,
    val phone: String,
    val inmateId: String,
    val inmateName: String,
    val relationship: String,
    val scheduledDate: String,
    val timeSlot: String,
    val boothNumber: String,
    val backgroundCheck: String = "Approved",
    val contrabandScreeningPassed: Boolean = false,
    val status: String, // "Scheduled", "Checked In", "Completed", "Denied Entry"
    val checkInTime: String? = null,
    val checkOutTime: String? = null,
    val officerNotes: String = ""
)

@Entity(tableName = "medications")
data class MedicationAdminRecord(
    @PrimaryKey val id: String,
    val inmateId: String,
    val inmateName: String,
    val cellLocation: String,
    val medicationName: String,
    val dosage: String,
    val frequency: String,
    val prescribingDoctor: String,
    val scheduledTime: String,
    val administered: Boolean = false,
    val administeredAt: String? = null,
    val administeredBy: String? = null,
    val vitalSignsCheck: String? = null,
    val specialInstructions: String? = null
)

@Entity(tableName = "staff")
data class StaffOfficer(
    @PrimaryKey val id: String,
    val name: String,
    val badge: String,
    val rank: String,
    val assignedPost: String,
    val shift: String,
    val radioChannel: String,
    val status: String, // "On Duty", "On Patrol", "Meal Break", "Post Relief", "Off Duty"
    val phoneExtension: String
)

@Entity(tableName = "facility_state")
data class FacilityState(
    @PrimaryKey val id: Int = 1,
    val facilityName: String = "Ironwood State Correctional Facility",
    val institutionCode: String = "ISCF-NORTH",
    val facilityAlertLevel: String = "Normal Operations", // "Normal Operations", "Elevated Precaution", "Cellblock Lockdown", "Facility Full Lockdown"
    val operationalCapacity: Int = 1200,
    val lockdownReason: String? = null,
    val lockdownInitiatedAt: String? = null,
    val lockdownInitiatedBy: String? = null
)
```

### `app/src/main/java/com/ironwood/pims/data/model/Converters.kt`
```kotlin
package com.ironwood.pims.data.model

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromStringList(value: List<String>?): String = gson.toJson(value ?: emptyList<String>())
    @TypeConverter
    fun toStringList(value: String): List<String> = gson.fromJson(value, object : TypeToken<List<String>>() {}.type)

    @TypeConverter
    fun fromChargeList(value: List<ChargeRecord>?): String = gson.toJson(value ?: emptyList<ChargeRecord>())
    @TypeConverter
    fun toChargeList(value: String): List<ChargeRecord> = gson.fromJson(value, object : TypeToken<List<ChargeRecord>>() {}.type)

    @TypeConverter
    fun fromBiometrics(value: BiometricRecord): String = gson.toJson(value)
    @TypeConverter
    fun toBiometrics(value: String): BiometricRecord = gson.fromJson(value, BiometricRecord::class.java)

    @TypeConverter
    fun fromEmergencyContact(value: EmergencyContact): String = gson.toJson(value)
    @TypeConverter
    fun toEmergencyContact(value: String): EmergencyContact = gson.fromJson(value, EmergencyContact::class.java)

    @TypeConverter
    fun fromCellList(value: List<CellRecord>?): String = gson.toJson(value ?: emptyList<CellRecord>())
    @TypeConverter
    fun toCellList(value: String): List<CellRecord> = gson.fromJson(value, object : TypeToken<List<CellRecord>>() {}.type)

    @TypeConverter
    fun fromVerificationList(value: List<InmateVerification>?): String = gson.toJson(value ?: emptyList<InmateVerification>())
    @TypeConverter
    fun toVerificationList(value: String): List<InmateVerification> = gson.fromJson(value, object : TypeToken<List<InmateVerification>>() {}.type)

    @TypeConverter
    fun fromInvolvedList(value: List<InvolvedInmate>?): String = gson.toJson(value ?: emptyList<InvolvedInmate>())
    @TypeConverter
    fun toInvolvedList(value: String): List<InvolvedInmate> = gson.fromJson(value, object : TypeToken<List<InvolvedInmate>>() {}.type)
}
```

---

## 6. Room Database, DAO & Pre-Seeding

### `app/src/main/java/com/ironwood/pims/data/local/PimsDao.kt`
```kotlin
package com.ironwood.pims.data.local

import androidx.room.*
import com.ironwood.pims.data.model.*
import kotlinx.coroutines.flow.Flow

@Dao
interface PimsDao {
    // Facility State
    @Query("SELECT * FROM facility_state WHERE id = 1")
    fun getFacilityState(): Flow<FacilityState?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveFacilityState(state: FacilityState)

    // Inmates
    @Query("SELECT * FROM inmates ORDER BY lastName ASC")
    fun getAllInmates(): Flow<List<Inmate>>

    @Query("SELECT * FROM inmates WHERE id = :id")
    suspend fun getInmateById(id: String): Inmate?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertInmate(inmate: Inmate)

    @Update
    suspend fun updateInmate(inmate: Inmate)

    // Housing Blocks
    @Query("SELECT * FROM housing_blocks")
    fun getAllHousingBlocks(): Flow<List<HousingBlock>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHousingBlocks(blocks: List<HousingBlock>)

    @Update
    suspend fun updateHousingBlock(block: HousingBlock)

    // Headcounts
    @Query("SELECT * FROM headcounts ORDER BY id DESC LIMIT 1")
    fun getLatestHeadcount(): Flow<HeadcountRoll?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertHeadcount(headcount: HeadcountRoll)

    @Update
    suspend fun updateHeadcount(headcount: HeadcountRoll)

    // Incidents
    @Query("SELECT * FROM incidents ORDER BY timestamp DESC")
    fun getAllIncidents(): Flow<List<IncidentReport>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIncident(incident: IncidentReport)

    @Update
    suspend fun updateIncident(incident: IncidentReport)

    // Visitors
    @Query("SELECT * FROM visitors ORDER BY scheduledDate DESC, timeSlot ASC")
    fun getAllVisitors(): Flow<List<VisitorRecord>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVisitor(visitor: VisitorRecord)

    @Update
    suspend fun updateVisitor(visitor: VisitorRecord)

    // Medications
    @Query("SELECT * FROM medications")
    fun getAllMedications(): Flow<List<MedicationAdminRecord>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMedication(med: MedicationAdminRecord)

    @Update
    suspend fun updateMedication(med: MedicationAdminRecord)

    // Staff
    @Query("SELECT * FROM staff")
    fun getAllStaff(): Flow<List<StaffOfficer>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStaff(staff: List<StaffOfficer>)

    @Update
    suspend fun updateStaff(officer: StaffOfficer)
}
```

### `app/src/main/java/com/ironwood/pims/data/local/PimsDatabase.kt`
```kotlin
package com.ironwood.pims.data.local

import android.content.Context
import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import com.ironwood.pims.data.model.*
import com.ironwood.pims.data.seed.MockData
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        FacilityState::class,
        Inmate::class,
        HousingBlock::class,
        HeadcountRoll::class,
        IncidentReport::class,
        VisitorRecord::class,
        MedicationAdminRecord::class,
        StaffOfficer::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class PimsDatabase : RoomDatabase() {
    abstract fun pimsDao(): PimsDao

    companion object {
        @Volatile private var instance: PimsDatabase? = null

        fun getInstance(context: Context): PimsDatabase {
            return instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    PimsDatabase::class.java,
                    "ironwood_pims.db"
                )
                .addCallback(object : Callback() {
                    override fun onCreate(db: SupportSQLiteDatabase) {
                        super.onCreate(db)
                        CoroutineScope(Dispatchers.IO).launch {
                            val dao = getInstance(context).pimsDao()
                            MockData.seedDatabase(dao)
                        }
                    }
                })
                .build().also { instance = it }
            }
        }
    }
}
```

### `app/src/main/java/com/ironwood/pims/data/seed/MockData.kt`
```kotlin
package com.ironwood.pims.data.seed

import com.ironwood.pims.data.local.PimsDao
import com.ironwood.pims.data.model.*

object MockData {
    suspend fun seedDatabase(dao: PimsDao) {
        dao.saveFacilityState(
            FacilityState(
                facilityName = "Ironwood State Correctional Facility",
                institutionCode = "ISCF-NORTH",
                facilityAlertLevel = "Normal Operations",
                operationalCapacity = 1200
            )
        )

        val inmates = listOf(
            Inmate(
                id = "INM-84920",
                bookingNumber = "BK-2023-0492",
                stateIdNumber = "SID-8839102",
                firstName = "Marcus",
                middleName = "Dean",
                lastName = "Vance",
                aliases = listOf("Vance", "D-Vance"),
                dateOfBirth = "1988-04-12",
                gender = "Male",
                securityLevel = SecurityLevel.Maximum,
                custodyStatus = CustodyStatus.InCustody,
                cellBlock = HousingBlockCode.BlockC,
                cellNumber = "C-102",
                bunk = "Lower",
                admissionDate = "2023-10-26",
                projectedReleaseDate = "2035-08-14",
                paroleEligibilityDate = "2031-11-01",
                primaryOffense = "Armed Robbery & Aggravated Assault",
                charges = listOf(
                    ChargeRecord("PEN-211-AR", "Armed Robbery with Firearm", "Class A", 10.0, "2023-11-15", "1st Circuit Superior Court"),
                    ChargeRecord("PEN-245-AA", "Assault with Deadly Weapon", "Class B", 5.0, "2023-11-15", "1st Circuit Superior Court")
                ),
                bailAmount = 500000.0,
                bailEligible = false,
                biometrics = BiometricRecord("6' 1\"", "195 lbs", "Brown", "Brown", "Barbed wire tattoo right forearm", "O+"),
                medicalAlerts = listOf("Chronic Asthma"),
                suicideWatch = false,
                gangAffiliation = "None Reported",
                trustAccountBalance = 245.50,
                workDetail = "Industrial Laundry Detail",
                emergencyContact = EmergencyContact("Evelyn Vance", "Mother", "(555) 234-8901"),
                assignedOfficer = "Sgt. D. Kowalski (#408)",
                notes = "Requires maximum security escort."
            ),
            Inmate(
                id = "INM-72104",
                bookingNumber = "BK-2023-0118",
                stateIdNumber = "SID-4410294",
                firstName = "Thomas",
                middleName = "Ray",
                lastName = "Callahan",
                aliases = listOf("Tommy Guns"),
                dateOfBirth = "1974-09-03",
                gender = "Male",
                securityLevel = SecurityLevel.Medium,
                custodyStatus = CustodyStatus.InCustody,
                cellBlock = HousingBlockCode.BlockB,
                cellNumber = "B-204",
                bunk = "Lower",
                admissionDate = "2023-10-24",
                projectedReleaseDate = "2028-05-20",
                paroleEligibilityDate = "2026-12-10",
                primaryOffense = "Grand Larceny & Racketeering",
                charges = listOf(
                    ChargeRecord("PEN-487-GL", "Grand Theft Exceeding \$100k", "Class B", 5.0, "2023-12-02", "Federal Court")
                ),
                bailAmount = 150000.0,
                bailEligible = false,
                biometrics = BiometricRecord("5' 11\"", "205 lbs", "Hazel", "Graying", "Anchor tattoo left chest", "A+"),
                medicalAlerts = listOf("Type 2 Diabetes (Metformin)"),
                suicideWatch = false,
                trustAccountBalance = 1210.00,
                workDetail = "Library Clerk",
                emergencyContact = EmergencyContact("Karen Callahan", "Sister", "(555) 345-6712"),
                assignedOfficer = "Off. R. Henderson (#512)"
            ),
            Inmate(
                id = "INM-93041",
                bookingNumber = "BK-2023-0941",
                stateIdNumber = "SID-7193021",
                firstName = "Jessica",
                middleName = "Marie",
                lastName = "Alvarez",
                aliases = listOf("Jessie"),
                dateOfBirth = "1991-05-12",
                gender = "Female",
                securityLevel = SecurityLevel.Medium,
                custodyStatus = CustodyStatus.InCustody,
                cellBlock = HousingBlockCode.WardM,
                cellNumber = "M-101",
                bunk = "Single",
                admissionDate = "2023-10-26",
                projectedReleaseDate = "2029-03-30",
                paroleEligibilityDate = "2027-04-15",
                primaryOffense = "Distribution of Controlled Substances",
                charges = listOf(
                    ChargeRecord("HSC-11352", "Transport / Sale of Narcotics", "Class A", 6.0, "2024-01-10", "Municipal Court")
                ),
                bailAmount = 250000.0,
                bailEligible = false,
                biometrics = BiometricRecord("5' 6\"", "135 lbs", "Brown", "Blonde", "Small bird tattoo left collarbone", "B+"),
                medicalAlerts = listOf("Penicillin Allergy", "Post-Surgical Monitoring"),
                trustAccountBalance = 430.75,
                workDetail = "Ward Sanitation Assistant",
                emergencyContact = EmergencyContact("Carlos Alvarez", "Father", "(555) 789-1234"),
                assignedOfficer = "Off. S. Rodriguez (#334)"
            ),
            Inmate(
                id = "INM-61209",
                bookingNumber = "BK-2022-0761",
                stateIdNumber = "SID-1102948",
                firstName = "Derrick",
                middleName = "James",
                lastName = "Holt",
                aliases = listOf("D-Rock"),
                dateOfBirth = "1984-11-20",
                gender = "Male",
                securityLevel = SecurityLevel.Supermax,
                custodyStatus = CustodyStatus.SolitaryConfinement,
                cellBlock = HousingBlockCode.BlockD,
                cellNumber = "D-004",
                bunk = "Single",
                admissionDate = "2022-08-14",
                projectedReleaseDate = "2044-10-01",
                paroleEligibilityDate = "2038-06-01",
                primaryOffense = "Second Degree Murder & Inmate Assault",
                charges = listOf(
                    ChargeRecord("PEN-187-M2", "Murder 2nd Degree", "Class A", 20.0, "2022-09-19", "Supreme Criminal Court")
                ),
                biometrics = BiometricRecord("6' 3\"", "220 lbs", "Brown", "Black", "Teardrop tattoo left eye", "AB-"),
                medicalAlerts = listOf("Hypertension", "High Violence Risk"),
                emergencyContact = EmergencyContact("Tanya Holt", "Spouse", "(555) 432-8765"),
                assignedOfficer = "Lt. M. Briggs (#109)",
                notes = "Requires two-officer escort with mechanical restraints."
            )
        )
        inmates.forEach { dao.insertInmate(it) }

        // Seed Housing Blocks
        val blocks = listOf(
            HousingBlock(
                id = "block-a",
                code = HousingBlockCode.BlockA,
                name = "Block A - Minimum Security Wing",
                securityTier = "Minimum",
                totalCells = 12,
                capacity = 24,
                cells = listOf(
                    CellRecord("A-101", 2, emptyList()),
                    CellRecord("A-102", 2, emptyList()),
                    CellRecord("A-103", 2, emptyList()),
                    CellRecord("A-104", 2, emptyList())
                )
            ),
            HousingBlock(
                id = "block-b",
                code = HousingBlockCode.BlockB,
                name = "Block B - Medium Security Tier",
                securityTier = "Medium",
                totalCells = 8,
                capacity = 16,
                cells = listOf(
                    CellRecord("B-101", 2, emptyList()),
                    CellRecord("B-204", 2, listOf("INM-72104"))
                )
            ),
            HousingBlock(
                id = "block-c",
                code = HousingBlockCode.BlockC,
                name = "Block C - High / Maximum Custody",
                securityTier = "Maximum",
                totalCells = 6,
                capacity = 12,
                cells = listOf(
                    CellRecord("C-101", 2, emptyList()),
                    CellRecord("C-102", 2, listOf("INM-84920"))
                )
            ),
            HousingBlock(
                id = "block-d",
                code = HousingBlockCode.BlockD,
                name = "Block D - Restrictive Housing",
                securityTier = "Segregation",
                totalCells = 5,
                capacity = 5,
                cells = listOf(
                    CellRecord("D-004", 1, listOf("INM-61209"))
                )
            ),
            HousingBlock(
                id = "ward-m",
                code = HousingBlockCode.WardM,
                name = "Ward M - Medical Wing",
                securityTier = "Medical",
                totalCells = 3,
                capacity = 3,
                cells = listOf(
                    CellRecord("M-101", 1, listOf("INM-93041"))
                )
            )
        )
        dao.insertHousingBlocks(blocks)

        // Seed Initial Headcount
        dao.insertHeadcount(
            HeadcountRoll(
                id = "COUNT-2026-001",
                shift = "Morning Muster (06:00)",
                countDate = "2026-11-03",
                scheduledTime = "06:00",
                status = "Reconciled",
                censusTarget = 4,
                verifiedTotal = 4,
                unaccountedCount = 0,
                conductedByOfficer = "Sgt. D. Kowalski (#408)",
                certifyingSupervisor = "Capt. J. Miller (#101)",
                completedAt = "06:22",
                inmateVerifications = inmates.map {
                    InmateVerification(
                        inmateId = it.id,
                        inmateName = "${it.firstName} ${it.lastName}",
                        cellBlock = it.cellBlock,
                        cellNumber = it.cellNumber,
                        status = it.custodyStatus,
                        verified = true,
                        verifiedAt = "06:15",
                        verifiedBy = "Watch Officer"
                    )
                }
            )
        )

        // Seed Incidents
        dao.insertIncident(
            IncidentReport(
                id = "INC-2026-0881",
                incidentNumber = "IR-2026-0881",
                timestamp = "2026-11-02 15:45",
                location = "Block C Rec Yard North",
                cellBlock = HousingBlockCode.BlockC,
                category = "Contraband Seizure",
                severity = "Medium",
                involvedInmates = listOf(InvolvedInmate("INM-84920", "Marcus Vance", "Participant")),
                reportingOfficer = "Off. J. Martinez",
                badgeNumber = "518",
                summary = "Canine search located 4.5-inch sharpened ceramic edge shank in concrete bench.",
                evidenceItems = listOf("4.5-inch sharpened ceramic shank"),
                disciplinaryStatus = "Under Investigation"
            )
        )

        // Seed Visitors
        dao.insertVisitor(
            VisitorRecord(
                id = "VIS-2026-101",
                visitorName = "Arthur Sterling, Esq.",
                idDocumentType = "Bar Association Card",
                idNumber = "BAR-994102",
                phone = "(555) 441-2299",
                inmateId = "INM-84920",
                inmateName = "Marcus Vance",
                relationship = "Attorney / Legal Counsel",
                scheduledDate = "2026-11-03",
                timeSlot = "13:30 - 14:30",
                boothNumber = "Legal Conf Room A",
                backgroundCheck = "Approved",
                contrabandScreeningPassed = true,
                status = "Checked In",
                officerNotes = "Confidential attorney-client privileged visit."
            )
        )

        // Seed Medications
        dao.insertMedication(
            MedicationAdminRecord(
                id = "MED-01",
                inmateId = "INM-72104",
                inmateName = "Thomas Callahan",
                cellLocation = "B-204",
                medicationName = "Metformin HCl",
                dosage = "500 mg Tablet",
                frequency = "Twice daily with meals (08:00 & 17:00)",
                prescribingDoctor = "Dr. Rachel Kim, MD",
                scheduledTime = "08:00",
                administered = true,
                administeredAt = "08:12",
                administeredBy = "Nurse E. Garcia, RN"
            )
        )

        // Seed Staff
        val staff = listOf(
            StaffOfficer("STF-101", "Captain James Miller", "101", "Captain", "Central Security Control & Watch Commander", "Day Shift (06:00 - 14:00)", "TAC-1 (Command)", "On Duty", "x1001"),
            StaffOfficer("STF-408", "Sgt. David Kowalski", "408", "Sergeant", "Block C High Security Supervisor", "Day Shift (06:00 - 14:00)", "TAC-3 (Block C/D)", "On Duty", "x1048"),
            StaffOfficer("STF-109", "Lt. Marcus Briggs", "109", "Lieutenant", "Block D Restrictive Housing OIC", "Day Shift (06:00 - 14:00)", "TAC-3 (Block C/D)", "On Duty", "x1029"),
            StaffOfficer("STF-512", "Off. Robert Henderson", "512", "Senior Officer", "Block B Dayroom & Tiers", "Day Shift (06:00 - 14:00)", "TAC-2 (Block A/B)", "On Duty", "x1052")
        )
        dao.insertStaff(staff)
    }
}
```

---

## 7. Repository & ViewModel Layer

### `app/src/main/java/com/ironwood/pims/data/repository/PrisonRepository.kt`
```kotlin
package com.ironwood.pims.data.repository

import com.ironwood.pims.data.model.*
import kotlinx.coroutines.flow.Flow

interface PrisonRepository {
    fun getFacilityState(): Flow<FacilityState?>
    suspend fun updateFacilityAlertLevel(level: String, reason: String? = null)

    fun getAllInmates(): Flow<List<Inmate>>
    suspend fun insertInmate(inmate: Inmate)
    suspend fun updateInmate(inmate: Inmate)
    suspend fun reassignInmateCell(inmateId: String, newBlock: HousingBlockCode, newCell: String, newBunk: String)

    fun getAllHousingBlocks(): Flow<List<HousingBlock>>
    fun getLatestHeadcount(): Flow<HeadcountRoll?>
    suspend fun insertHeadcount(headcount: HeadcountRoll)
    suspend fun verifyInmateCount(inmateId: String, verified: Boolean, notes: String? = null)
    suspend fun flagInmateUnaccounted(inmateId: String, flagged: Boolean, notes: String? = null)
    suspend fun certifyHeadcount(supervisor: String)
    suspend fun startNewHeadcount(shift: String)

    fun getAllIncidents(): Flow<List<IncidentReport>>
    suspend fun insertIncident(incident: IncidentReport)
    suspend fun updateIncidentStatus(incidentId: String, status: String, sanctions: String? = null)

    fun getAllVisitors(): Flow<List<VisitorRecord>>
    suspend fun insertVisitor(visitor: VisitorRecord)
    suspend fun updateVisitorStatus(visitorId: String, status: String, passedScreening: Boolean? = null)

    fun getAllMedications(): Flow<List<MedicationAdminRecord>>
    suspend fun insertMedication(med: MedicationAdminRecord)
    suspend fun markMedAdministered(medId: String, nurse: String, vitals: String? = null)

    fun getAllStaff(): Flow<List<StaffOfficer>>
    suspend fun updateStaffStatus(staffId: String, status: String)
}
```

### `app/src/main/java/com/ironwood/pims/data/repository/PrisonRepositoryImpl.kt`
```kotlin
package com.ironwood.pims.data.repository

import com.ironwood.pims.data.local.PimsDao
import com.ironwood.pims.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import java.text.SimpleDateFormat
import java.util.*

class PrisonRepositoryImpl(private val dao: PimsDao) : PrisonRepository {
    override fun getFacilityState(): Flow<FacilityState?> = dao.getFacilityState()

    override suspend fun updateFacilityAlertLevel(level: String, reason: String?) {
        val current = dao.getFacilityState().firstOrNull() ?: FacilityState()
        val time = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US).format(Date())
        dao.saveFacilityState(
            current.copy(
                facilityAlertLevel = level,
                lockdownReason = if (level != "Normal Operations") reason else null,
                lockdownInitiatedAt = if (level != "Normal Operations") time else null,
                lockdownInitiatedBy = if (level != "Normal Operations") "Command Staff" else null
            )
        )
    }

    override fun getAllInmates(): Flow<List<Inmate>> = dao.getAllInmates()

    override suspend fun insertInmate(inmate: Inmate) {
        dao.insertInmate(inmate)
    }

    override suspend fun updateInmate(inmate: Inmate) {
        dao.updateInmate(inmate)
    }

    override suspend fun reassignInmateCell(
        inmateId: String,
        newBlock: HousingBlockCode,
        newCell: String,
        newBunk: String
    ) {
        val inmate = dao.getInmateById(inmateId) ?: return
        dao.updateInmate(
            inmate.copy(
                cellBlock = newBlock,
                cellNumber = newCell,
                bunk = newBunk
            )
        )
    }

    override fun getAllHousingBlocks(): Flow<List<HousingBlock>> = dao.getAllHousingBlocks()
    override fun getLatestHeadcount(): Flow<HeadcountRoll?> = dao.getLatestHeadcount()

    override suspend fun insertHeadcount(headcount: HeadcountRoll) {
        dao.insertHeadcount(headcount)
    }

    override suspend fun verifyInmateCount(inmateId: String, verified: Boolean, notes: String?) {
        val count = dao.getLatestHeadcount().firstOrNull() ?: return
        val time = SimpleDateFormat("HH:mm", Locale.US).format(Date())
        val updated = count.inmateVerifications.map {
            if (it.inmateId == inmateId) {
                it.copy(
                    verified = verified,
                    verifiedAt = if (verified) time else null,
                    verifiedBy = if (verified) "Watch Officer" else null,
                    flaggedUnaccounted = if (verified) false else it.flaggedUnaccounted,
                    notes = notes ?: it.notes
                )
            } else it
        }
        val verifiedTotal = updated.count { it.verified }
        val unaccounted = updated.count { it.flaggedUnaccounted }
        dao.updateHeadcount(
            count.copy(
                inmateVerifications = updated,
                verifiedTotal = verifiedTotal,
                unaccountedCount = unaccounted,
                status = if (unaccounted > 0) "Emergency Discrepancy" else if (verifiedTotal == count.censusTarget) "Reconciled" else "In Progress"
            )
        )
    }

    override suspend fun flagInmateUnaccounted(inmateId: String, flagged: Boolean, notes: String?) {
        val count = dao.getLatestHeadcount().firstOrNull() ?: return
        val updated = count.inmateVerifications.map {
            if (it.inmateId == inmateId) {
                it.copy(
                    flaggedUnaccounted = flagged,
                    verified = if (flagged) false else it.verified,
                    notes = notes ?: if (flagged) "FLAGGED: Unaccounted in physical roll!" else it.notes
                )
            } else it
        }
        val verifiedTotal = updated.count { it.verified }
        val unaccounted = updated.count { it.flaggedUnaccounted }
        dao.updateHeadcount(
            count.copy(
                inmateVerifications = updated,
                verifiedTotal = verifiedTotal,
                unaccountedCount = unaccounted,
                status = if (unaccounted > 0) "Emergency Discrepancy" else if (verifiedTotal == count.censusTarget) "Reconciled" else "In Progress"
            )
        )
    }

    override suspend fun certifyHeadcount(supervisor: String) {
        val count = dao.getLatestHeadcount().firstOrNull() ?: return
        val time = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US).format(Date())
        dao.updateHeadcount(
            count.copy(
                certifyingSupervisor = supervisor,
                completedAt = time,
                status = if (count.unaccountedCount > 0) "Emergency Discrepancy" else "Reconciled"
            )
        )
    }

    override suspend fun startNewHeadcount(shift: String) {
        val inmates = dao.getAllInmates().firstOrNull() ?: emptyList()
        val time = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val newRoll = HeadcountRoll(
            id = "COUNT-${System.currentTimeMillis()}",
            shift = shift,
            countDate = time,
            scheduledTime = if (shift.contains("06:00")) "06:00" else if (shift.contains("12:00")) "12:00" else "18:00",
            status = "In Progress",
            censusTarget = inmates.size,
            verifiedTotal = 0,
            unaccountedCount = 0,
            conductedByOfficer = "Watch Commander Team",
            certifyingSupervisor = "Capt. J. Miller (#101)",
            inmateVerifications = inmates.map {
                InmateVerification(
                    inmateId = it.id,
                    inmateName = "${it.firstName} ${it.lastName}",
                    cellBlock = it.cellBlock,
                    cellNumber = it.cellNumber,
                    status = it.custodyStatus,
                    verified = false,
                    flaggedUnaccounted = false
                )
            }
        )
        dao.insertHeadcount(newRoll)
    }

    override fun getAllIncidents(): Flow<List<IncidentReport>> = dao.getAllIncidents()
    override suspend fun insertIncident(incident: IncidentReport) = dao.insertIncident(incident)
    override suspend fun updateIncidentStatus(incidentId: String, status: String, sanctions: String?) {
        val all = dao.getAllIncidents().firstOrNull() ?: return
        val match = all.find { it.id == incidentId } ?: return
        dao.updateIncident(match.copy(disciplinaryStatus = status, sanctionsApplied = sanctions ?: match.sanctionsApplied))
    }

    override fun getAllVisitors(): Flow<List<VisitorRecord>> = dao.getAllVisitors()
    override suspend fun insertVisitor(visitor: VisitorRecord) = dao.insertVisitor(visitor)
    override suspend fun updateVisitorStatus(visitorId: String, status: String, passedScreening: Boolean?) {
        val all = dao.getAllVisitors().firstOrNull() ?: return
        val match = all.find { it.id == visitorId } ?: return
        val time = SimpleDateFormat("HH:mm", Locale.US).format(Date())
        dao.updateVisitor(
            match.copy(
                status = status,
                contrabandScreeningPassed = passedScreening ?: match.contrabandScreeningPassed,
                checkInTime = if (status == "Checked In") time else match.checkInTime,
                checkOutTime = if (status == "Completed") time else match.checkOutTime
            )
        )
    }

    override fun getAllMedications(): Flow<List<MedicationAdminRecord>> = dao.getAllMedications()
    override suspend fun insertMedication(med: MedicationAdminRecord) = dao.insertMedication(med)
    override suspend fun markMedAdministered(medId: String, nurse: String, vitals: String?) {
        val all = dao.getAllMedications().firstOrNull() ?: return
        val match = all.find { it.id == medId } ?: return
        val time = SimpleDateFormat("HH:mm", Locale.US).format(Date())
        dao.updateMedication(
            match.copy(
                administered = true,
                administeredAt = time,
                administeredBy = nurse,
                vitalSignsCheck = vitals ?: match.vitalSignsCheck
            )
        )
    }

    override fun getAllStaff(): Flow<List<StaffOfficer>> = dao.getAllStaff()
    override suspend fun updateStaffStatus(staffId: String, status: String) {
        val all = dao.getAllStaff().firstOrNull() ?: return
        val match = all.find { it.id == staffId } ?: return
        dao.updateStaff(match.copy(status = status))
    }
}
```

### `app/src/main/java/com/ironwood/pims/ui/viewmodel/PrisonViewModel.kt`
```kotlin
package com.ironwood.pims.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ironwood.pims.data.model.*
import com.ironwood.pims.data.repository.PrisonRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

enum class PimsScreenTab {
    Dashboard,
    Inmates,
    Headcount,
    Housing,
    Incidents,
    Visitors,
    Medical,
    Staff
}

class PrisonViewModel(private val repository: PrisonRepository) : ViewModel() {

    val facilityState = repository.getFacilityState()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), FacilityState())

    val inmates = repository.getAllInmates()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val housingBlocks = repository.getAllHousingBlocks()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val headcount = repository.getLatestHeadcount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val incidents = repository.getAllIncidents()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val visitors = repository.getAllVisitors()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val medications = repository.getAllMedications()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val staff = repository.getAllStaff()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // UI State
    var currentTab = MutableStateFlow(PimsScreenTab.Dashboard)
    var searchQuery = MutableStateFlow("")

    // Selected Dialog States
    var selectedInmateForDossier = MutableStateFlow<Inmate?>(null)
    var selectedInmateForPrint = MutableStateFlow<Inmate?>(null)
    var isBookingModalOpen = MutableStateFlow(false)
    var isLockdownModalOpen = MutableStateFlow(false)

    fun setTab(tab: PimsScreenTab) {
        currentTab.value = tab
    }

    fun setSearch(query: String) {
        searchQuery.value = query
    }

    fun openDossier(inmate: Inmate) {
        selectedInmateForDossier.value = inmate
    }

    fun closeDossier() {
        selectedInmateForDossier.value = null
    }

    fun openPrintJacket(inmate: Inmate) {
        selectedInmateForPrint.value = inmate
    }

    fun closePrintJacket() {
        selectedInmateForPrint.value = null
    }

    fun setLockdownLevel(level: String, reason: String? = null) {
        viewModelScope.launch {
            repository.updateFacilityAlertLevel(level, reason)
        }
    }

    fun addInmate(inmate: Inmate) {
        viewModelScope.launch {
            repository.insertInmate(inmate)
        }
    }

    fun reassignCell(inmateId: String, newBlock: HousingBlockCode, newCell: String, newBunk: String) {
        viewModelScope.launch {
            repository.reassignInmateCell(inmateId, newBlock, newCell, newBunk)
        }
    }

    fun verifyHeadcount(inmateId: String, verified: Boolean, notes: String? = null) {
        viewModelScope.launch {
            repository.verifyInmateCount(inmateId, verified, notes)
        }
    }

    fun flagUnaccounted(inmateId: String, flagged: Boolean, notes: String? = null) {
        viewModelScope.launch {
            repository.flagInmateUnaccounted(inmateId, flagged, notes)
        }
    }

    fun certifyCount(supervisor: String) {
        viewModelScope.launch {
            repository.certifyHeadcount(supervisor)
        }
    }

    fun startCount(shift: String) {
        viewModelScope.launch {
            repository.startNewHeadcount(shift)
        }
    }

    fun addIncident(incident: IncidentReport) {
        viewModelScope.launch {
            repository.insertIncident(incident)
        }
    }

    fun updateIncidentStatus(incidentId: String, status: String, sanctions: String? = null) {
        viewModelScope.launch {
            repository.updateIncidentStatus(incidentId, status, sanctions)
        }
    }

    fun addVisitor(visitor: VisitorRecord) {
        viewModelScope.launch {
            repository.insertVisitor(visitor)
        }
    }

    fun updateVisitorStatus(visitorId: String, status: String, screened: Boolean? = null) {
        viewModelScope.launch {
            repository.updateVisitorStatus(visitorId, status, screened)
        }
    }

    fun addMedication(med: MedicationAdminRecord) {
        viewModelScope.launch {
            repository.insertMedication(med)
        }
    }

    fun dispenseMedication(medId: String, nurse: String, vitals: String? = null) {
        viewModelScope.launch {
            repository.markMedAdministered(medId, nurse, vitals)
        }
    }

    fun updateStaffDutyStatus(staffId: String, status: String) {
        viewModelScope.launch {
            repository.updateStaffStatus(staffId, status)
        }
    }
}
```

---

## 8. Jetpack Compose Theme & Dark Institutional Styling

### `app/src/main/java/com/ironwood/pims/ui/theme/Color.kt`
```kotlin
package com.ironwood.pims.ui.theme

import androidx.compose.ui.graphics.Color

val Slate950 = Color(0xFF030712)
val Slate900 = Color(0xFF0F172A)
val Slate800 = Color(0xFF1E293B)
val Slate700 = Color(0xFF334155)
val Slate600 = Color(0xFF475569)
val Slate400 = Color(0xFF94A3B8)
val Slate200 = Color(0xFFE2E8F0)
val Slate100 = Color(0xFFF1F5F9)

val Amber500 = Color(0xFFF59E0B)
val Amber400 = Color(0xFFFBBF24)
val Amber300 = Color(0xFFFCD34D)
val Amber950 = Color(0xFF451A03)

val Emerald400 = Color(0xFF34D399)
val Emerald500 = Color(0xFF10B981)
val Emerald950 = Color(0xFF064E3B)

val Red400 = Color(0xFFF87171)
val Red500 = Color(0xFFEF4444)
val Red950 = Color(0xFF450A0A)

val Cyan400 = Color(0xFF22D3EE)
val Cyan950 = Color(0xFF083344)
```

### `app/src/main/java/com/ironwood/pims/ui/theme/Theme.kt`
```kotlin
package com.ironwood.pims.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Amber400,
    onPrimary = Slate950,
    primaryContainer = Amber950,
    onPrimaryContainer = Amber300,
    secondary = Slate400,
    onSecondary = Slate950,
    surface = Slate900,
    onSurface = Slate100,
    background = Slate950,
    onBackground = Slate100,
    error = Red400,
    onError = Color.White
)

@Composable
fun IronwoodPIMSTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
```

### `app/src/main/java/com/ironwood/pims/ui/theme/Type.kt`
```kotlin
package com.ironwood.pims.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        letterSpacing = 0.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        letterSpacing = 0.15.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp
    )
)
```

---

## 9. Top Navigation & Main Shell Layout

### `app/src/main/java/com/ironwood/pims/MainActivity.kt`
```kotlin
package com.ironwood.pims

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ironwood.pims.data.local.PimsDatabase
import com.ironwood.pims.data.repository.PrisonRepositoryImpl
import com.ironwood.pims.ui.components.TopCommandBar
import com.ironwood.pims.ui.dialogs.*
import com.ironwood.pims.ui.screens.*
import com.ironwood.pims.ui.theme.IronwoodPIMSTheme
import com.ironwood.pims.ui.theme.Slate950
import com.ironwood.pims.ui.viewmodel.PimsScreenTab
import com.ironwood.pims.ui.viewmodel.PrisonViewModel
import com.ironwood.pims.ui.viewmodel.PrisonViewModelFactory

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val database = PimsDatabase.getInstance(this)
        val repository = PrisonRepositoryImpl(database.pimsDao())
        val factory = PrisonViewModelFactory(repository)

        setContent {
            IronwoodPIMSTheme {
                val viewModel: PrisonViewModel = viewModel(factory = factory)
                val currentTab by viewModel.currentTab.collectAsState()
                val selectedDossier by viewModel.selectedInmateForDossier.collectAsState()
                val selectedPrint by viewModel.selectedInmateForPrint.collectAsState()
                val isBookingOpen by viewModel.isBookingModalOpen.collectAsState()
                val isLockdownOpen by viewModel.isLockdownModalOpen.collectAsState()

                Scaffold(
                    topBar = { TopCommandBar(viewModel) },
                    bottomBar = {
                        NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Dashboard,
                                onClick = { viewModel.setTab(PimsScreenTab.Dashboard) },
                                icon = { Icon(Icons.Default.Dashboard, contentDescription = "Dashboard") },
                                label = { Text("Command") }
                            )
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Inmates,
                                onClick = { viewModel.setTab(PimsScreenTab.Inmates) },
                                icon = { Icon(Icons.Default.People, contentDescription = "Roster") },
                                label = { Text("Inmates") }
                            )
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Headcount,
                                onClick = { viewModel.setTab(PimsScreenTab.Headcount) },
                                icon = { Icon(Icons.Default.FactCheck, contentDescription = "Muster") },
                                label = { Text("Muster") }
                            )
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Housing,
                                onClick = { viewModel.setTab(PimsScreenTab.Housing) },
                                icon = { Icon(Icons.Default.MeetingRoom, contentDescription = "Housing") },
                                label = { Text("Housing") }
                            )
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Incidents,
                                onClick = { viewModel.setTab(PimsScreenTab.Incidents) },
                                icon = { Icon(Icons.Default.Warning, contentDescription = "Incidents") },
                                label = { Text("Incidents") }
                            )
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Visitors,
                                onClick = { viewModel.setTab(PimsScreenTab.Visitors) },
                                icon = { Icon(Icons.Default.PersonSearch, contentDescription = "Visits") },
                                label = { Text("Visitors") }
                            )
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Medical,
                                onClick = { viewModel.setTab(PimsScreenTab.Medical) },
                                icon = { Icon(Icons.Default.LocalHospital, contentDescription = "Medical") },
                                label = { Text("Infirmary") }
                            )
                            NavigationBarItem(
                                selected = currentTab == PimsScreenTab.Staff,
                                onClick = { viewModel.setTab(PimsScreenTab.Staff) },
                                icon = { Icon(Icons.Default.Security, contentDescription = "Guards") },
                                label = { Text("Guards") }
                            )
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Slate950)
                            .padding(innerPadding)
                    ) {
                        when (currentTab) {
                            PimsScreenTab.Dashboard -> DashboardScreen(viewModel)
                            PimsScreenTab.Inmates -> InmatesRosterScreen(viewModel)
                            PimsScreenTab.Headcount -> HeadcountScreen(viewModel)
                            PimsScreenTab.Housing -> HousingMapScreen(viewModel)
                            PimsScreenTab.Incidents -> IncidentsScreen(viewModel)
                            PimsScreenTab.Visitors -> VisitorsScreen(viewModel)
                            PimsScreenTab.Medical -> MedicalWardScreen(viewModel)
                            PimsScreenTab.Staff -> StaffRosterScreen(viewModel)
                        }

                        // Dialogs
                        selectedDossier?.let { InmateDossierDialog(it, viewModel) }
                        selectedPrint?.let { PrintJacketDialog(it, viewModel) }
                        if (isBookingOpen) BookingIntakeDialog(viewModel)
                        if (isLockdownOpen) LockdownDialog(viewModel)
                    }
                }
            }
        }
    }
}
```

### `app/src/main/java/com/ironwood/pims/ui/viewmodel/PrisonViewModelFactory.kt`
```kotlin
package com.ironwood.pims.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.ironwood.pims.data.repository.PrisonRepository

class PrisonViewModelFactory(private val repository: PrisonRepository) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PrisonViewModel::class.java)) {
            return PrisonViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

### `app/src/main/java/com/ironwood/pims/ui/components/TopCommandBar.kt`
```kotlin
package com.ironwood.pims.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ironwood.pims.ui.theme.*
import com.ironwood.pims.ui.viewmodel.PrisonViewModel

@Composable
fun TopCommandBar(viewModel: PrisonViewModel) {
    val facility by viewModel.facilityState.collectAsState()
    val isNormal = facility?.facilityAlertLevel == "Normal Operations"

    Surface(
        color = Slate900,
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate800)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Zone 1: Facility Title & Code
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(Slate800)
                        .border(1.dp, Slate700, RoundedCornerShape(6.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("PIMS", color = Amber400, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        facility?.facilityName ?: "Ironwood Correctional",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Text(
                        "${facility?.institutionCode ?: "ISCF"} · LEVEL-IV MAXIMUM FACILITY",
                        color = Slate400,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.sp
                    )
                }
            }

            // Zone 2: Actions & Lockdown Trigger
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Security Alert Status
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = if (isNormal) Emerald950 else Red950,
                    border = CardDefaults.outlinedCardBorder().copy(
                        brush = androidx.compose.ui.graphics.SolidColor(if (isNormal) Emerald500 else Red500)
                    ),
                    modifier = Modifier.clickable { viewModel.isLockdownModalOpen.value = true }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            if (isNormal) Icons.Default.Shield else Icons.Default.Lock,
                            contentDescription = null,
                            tint = if (isNormal) Emerald400 else Red400,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            facility?.facilityAlertLevel ?: "Normal",
                            color = if (isNormal) Emerald400 else Red400,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                // Primary Intake Button
                Button(
                    onClick = { viewModel.isBookingModalOpen.value = true },
                    colors = ButtonDefaults.buttonColors(containerColor = Amber400, contentColor = Slate950),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Intake", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }
    }
}
```

---

## 10. Operations Center Screen (`DashboardScreen.kt`)

### `app/src/main/java/com/ironwood/pims/ui/screens/DashboardScreen.kt`
```kotlin
package com.ironwood.pims.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ironwood.pims.data.model.CustodyStatus
import com.ironwood.pims.data.model.SecurityLevel
import com.ironwood.pims.ui.theme.*
import com.ironwood.pims.ui.viewmodel.PimsScreenTab
import com.ironwood.pims.ui.viewmodel.PrisonViewModel

@Composable
fun DashboardScreen(viewModel: PrisonViewModel) {
    val facility by viewModel.facilityState.collectAsState()
    val inmates by viewModel.inmates.collectAsState()
    val blocks by viewModel.housingBlocks.collectAsState()
    val headcount by viewModel.headcount.collectAsState()
    val incidents by viewModel.incidents.collectAsState()

    val totalInCustody = inmates.count { it.custodyStatus != CustodyStatus.Released }
    val maxCapacity = facility?.operationalCapacity ?: 1200
    val solitaryCount = inmates.count { it.custodyStatus == CustodyStatus.SolitaryConfinement }
    val openIncidents = incidents.count { it.disciplinaryStatus != "Dismissed" }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Security Alert Header Banner if in Lockdown
        if (facility?.facilityAlertLevel != "Normal Operations") {
            item {
                Surface(
                    color = Red950,
                    shape = RoundedCornerShape(8.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Red500))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            "ALERT PROTOCOL: ${facility?.facilityAlertLevel}",
                            color = Red400,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Text(
                            facility?.lockdownReason ?: "Perimeter security active. Movement suspended.",
                            color = Slate200,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }
        }

        // 4 KPI Summary Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Card 1: Population
                KpiCard(
                    title = "POPULATION",
                    value = "$totalInCustody / $maxCapacity",
                    sub = "${((totalInCustody.toDouble() / maxCapacity) * 100).toInt()}% Capacity",
                    modifier = Modifier.weight(1f),
                    color = Amber400
                )
                // Card 2: Muster
                KpiCard(
                    title = "MUSTER COUNT",
                    value = "${headcount?.verifiedTotal ?: 0} / ${headcount?.censusTarget ?: totalInCustody}",
                    sub = headcount?.status ?: "Pending",
                    modifier = Modifier.weight(1f),
                    color = if (headcount?.status == "Reconciled") Emerald400 else Amber400
                )
            }
        }
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Card 3: Isolation
                KpiCard(
                    title = "SEGREGATION",
                    value = "$solitaryCount Inmates",
                    sub = "Block D Restrictive",
                    modifier = Modifier.weight(1f),
                    color = Red400
                )
                // Card 4: Disciplinary
                KpiCard(
                    title = "INCIDENTS",
                    value = "$openIncidents Active",
                    sub = "Disciplinary Cases",
                    modifier = Modifier.weight(1f),
                    color = Amber400
                )
            }
        }

        // Housing Block Capacity Section
        item {
            Text("HOUSING BLOCKS CENSUS", color = Slate400, fontWeight = FontWeight.Bold, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
        }

        items(blocks) { block ->
            val occupantsInBlock = inmates.count { it.cellBlock == block.code && it.custodyStatus != CustodyStatus.Released }
            val blockPercent = if (block.capacity > 0) (occupantsInBlock.toFloat() / block.capacity) else 0f

            Surface(
                color = Slate900,
                shape = RoundedCornerShape(8.dp),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate800))
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(block.name, color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        Text(
                            "$occupantsInBlock / ${block.capacity} Beds",
                            color = Amber400,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { blockPercent.coerceIn(0f, 1f) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = if (blockPercent > 0.85f) Red500 else if (blockPercent > 0.5f) Amber500 else Emerald500,
                        trackColor = Slate800
                    )
                }
            }
        }

        // Quick Command Shortcuts
        item {
            Text("COMMAND SHORTCUTS", color = Slate400, fontWeight = FontWeight.Bold, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = { viewModel.setTab(PimsScreenTab.Headcount) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900)
                ) {
                    Text("Execute Muster", color = Amber400, fontSize = 12.sp)
                }
                Button(
                    onClick = { viewModel.setTab(PimsScreenTab.Incidents) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Slate900)
                ) {
                    Text("Log Incident", color = Red400, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun KpiCard(title: String, value: String, sub: String, modifier: Modifier, color: Color) {
    Surface(
        color = Slate900,
        shape = RoundedCornerShape(8.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate800)),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(title, color = Slate400, fontSize = 10.sp, fontWeight = FontWeight.SemiBold, fontFamily = FontFamily.Monospace)
            Text(value, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp, fontFamily = FontFamily.Monospace, modifier = Modifier.padding(vertical = 4.dp))
            Text(sub, color = color, fontSize = 11.sp, fontWeight = FontWeight.Medium)
        }
    }
}
```

---

## 11. Inmates Roster & Search (`InmatesRosterScreen.kt`)

### `app/src/main/java/com/ironwood/pims/ui/screens/InmatesRosterScreen.kt`
```kotlin
package com.ironwood.pims.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Print
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ironwood.pims.data.model.Inmate
import com.ironwood.pims.data.model.SecurityLevel
import com.ironwood.pims.ui.theme.*
import com.ironwood.pims.ui.viewmodel.PrisonViewModel

@Composable
fun InmatesRosterScreen(viewModel: PrisonViewModel) {
    val inmates by viewModel.inmates.collectAsState()
    var search by remember { mutableStateOf("") }
    var selectedTierFilter by remember { mutableStateOf("ALL") }

    val filtered = inmates.filter { inmate ->
        val q = search.trim().lowercase()
        val matchesSearch = q.isEmpty() ||
                inmate.lastName.lowercase().contains(q) ||
                inmate.firstName.lowercase().contains(q) ||
                inmate.id.lowercase().contains(q) ||
                inmate.cellNumber.lowercase().contains(q) ||
                inmate.primaryOffense.lowercase().contains(q)

        val matchesTier = selectedTierFilter == "ALL" || inmate.securityLevel.name.equals(selectedTierFilter, ignoreCase = true)
        matchesSearch && matchesTier
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Search & Filter Row
        OutlinedTextField(
            value = search,
            onValueChange = { search = it },
            placeholder = { Text("Search by name, ID, charge, cell...", color = Slate400, fontSize = 12.sp) },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Slate400) },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = Slate900,
                unfocusedContainerColor = Slate900,
                focusedBorderColor = Amber400,
                unfocusedBorderColor = Slate800,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            )
        )

        // Tier Filter Chips
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("ALL", "Minimum", "Medium", "Maximum", "Supermax").forEach { tier ->
                FilterChip(
                    selected = selectedTierFilter == tier,
                    onClick = { selectedTierFilter = tier },
                    label = { Text(tier, fontSize = 11.sp, fontFamily = FontFamily.Monospace) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = Amber950,
                        selectedLabelColor = Amber400
                    )
                )
            }
        }

        Text(
            "${filtered.size} CUSTODY RECORDS ON FILE",
            color = Slate400,
            fontSize = 11.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Bold
        )

        // Inmate Cards List
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(filtered) { inmate ->
                InmateRowCard(
                    inmate = inmate,
                    onOpenDossier = { viewModel.openDossier(inmate) },
                    onOpenPrint = { viewModel.openPrintJacket(inmate) }
                )
            }
        }
    }
}

@Composable
fun InmateRowCard(inmate: Inmate, onOpenDossier: () -> Unit, onOpenPrint: () -> Unit) {
    Surface(
        color = Slate900,
        shape = RoundedCornerShape(8.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate800)),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onOpenDossier() }
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        "${inmate.lastName}, ${inmate.firstName} ${inmate.middleName ?: ""}",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Text(
                        "${inmate.id} · BOOK: ${inmate.bookingNumber}",
                        color = Amber400,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace
                    )
                }

                // Security Tier Badge
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = when (inmate.securityLevel) {
                        SecurityLevel.Supermax, SecurityLevel.Maximum -> Red950
                        SecurityLevel.Medium -> Amber950
                        SecurityLevel.Minimum -> Emerald950
                    },
                    border = CardDefaults.outlinedCardBorder().copy(
                        brush = androidx.compose.ui.graphics.SolidColor(
                            when (inmate.securityLevel) {
                                SecurityLevel.Supermax, SecurityLevel.Maximum -> Red500
                                SecurityLevel.Medium -> Amber500
                                SecurityLevel.Minimum -> Emerald500
                            }
                        )
                    )
                ) {
                    Text(
                        inmate.securityLevel.name.uppercase(),
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        color = when (inmate.securityLevel) {
                            SecurityLevel.Supermax, SecurityLevel.Maximum -> Red400
                            SecurityLevel.Medium -> Amber400
                            SecurityLevel.Minimum -> Emerald400
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                inmate.primaryOffense,
                color = Slate200,
                fontSize = 12.sp,
                maxLines = 1
            )

            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "Cell: ${inmate.cellNumber} (${inmate.cellBlock.name})",
                    color = Slate400,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(onClick = onOpenPrint, modifier = Modifier.size(24.dp)) {
                        Icon(Icons.Default.Print, contentDescription = "Print", tint = Slate400, modifier = Modifier.size(16.dp))
                    }
                    Text(
                        "Dossier >",
                        color = Amber400,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.clickable { onOpenDossier() }
                    )
                }
            }
        }
    }
}
```

---

## 12. Inmate Master Dossier Dialog (`InmateDossierDialog.kt`)

### `app/src/main/java/com/ironwood/pims/ui/dialogs/InmateDossierDialog.kt`
```kotlin
package com.ironwood.pims.ui.dialogs

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Print
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.ironwood.pims.data.model.CustodyStatus
import com.ironwood.pims.data.model.Inmate
import com.ironwood.pims.ui.theme.*
import com.ironwood.pims.ui.viewmodel.PrisonViewModel

@Composable
fun InmateDossierDialog(inmate: Inmate, viewModel: PrisonViewModel) {
    var selectedTab by remember { mutableStateOf(0) }
    val tabs = listOf("Profile", "Charges", "Housing", "Medical")

    Dialog(
        onDismissRequest = { viewModel.closeDossier() },
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.9f),
            shape = RoundedCornerShape(12.dp),
            color = Slate900,
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate700))
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate950)
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            "${inmate.lastName}, ${inmate.firstName} (${inmate.id})",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                        Text(
                            "MASTER CUSTODY DOSSIER · BOOK: ${inmate.bookingNumber}",
                            color = Amber400,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp
                        )
                    }

                    Row {
                        IconButton(onClick = { viewModel.openPrintJacket(inmate) }) {
                            Icon(Icons.Default.Print, contentDescription = "Print", tint = Amber400)
                        }
                        IconButton(onClick = { viewModel.closeDossier() }) {
                            Icon(Icons.Default.Close, contentDescription = "Close", tint = Slate400)
                        }
                    }
                }

                // Tab Row
                TabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = Slate900,
                    contentColor = Amber400
                ) {
                    tabs.forEachIndexed { index, title ->
                        Tab(
                            selected = selectedTab == index,
                            onClick = { selectedTab = index },
                            text = { Text(title, fontSize = 12.sp, fontWeight = FontWeight.SemiBold) }
                        )
                    }
                }

                // Tab Content
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(16.dp)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    when (selectedTab) {
                        0 -> {
                            // Biometrics & Personal
                            DossierField("Date of Birth", inmate.dateOfBirth)
                            DossierField("Gender", inmate.gender)
                            DossierField("Height / Weight", "${inmate.biometrics.height} · ${inmate.biometrics.weight}")
                            DossierField("Eyes / Hair", "${inmate.biometrics.eyeColor} / ${inmate.biometrics.hairColor}")
                            DossierField("Blood Type", inmate.biometrics.bloodType)
                            DossierField("Scars & Tattoos", inmate.biometrics.scarsAndTattoos)
                            DossierField("Emergency Contact", "${inmate.emergencyContact.name} (${inmate.emergencyContact.relationship}) - ${inmate.emergencyContact.phone}")
                            DossierField("Assigned Officer", inmate.assignedOfficer)
                        }
                        1 -> {
                            // Legal Charges
                            inmate.charges.forEach { charge ->
                                Surface(
                                    color = Slate950,
                                    shape = RoundedCornerShape(6.dp),
                                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate800)),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Text("${charge.code}: ${charge.title}", color = Amber400, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                        Text("Term: ${charge.sentenceYears} Yrs · Class: ${charge.felonyClass}", color = Color.White, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                                        Text("Jurisdiction: ${charge.courtJurisdiction}", color = Slate400, fontSize = 11.sp)
                                    }
                                }
                            }
                            DossierField("Parole Eligibility", inmate.paroleEligibilityDate)
                            DossierField("Projected Discharge", inmate.projectedReleaseDate)
                            DossierField("Trust Account", "\$${inmate.trustAccountBalance}")
                        }
                        2 -> {
                            // Housing Assignment
                            DossierField("Current Housing Wing", inmate.cellBlock.name)
                            DossierField("Cell Number", inmate.cellNumber)
                            DossierField("Bunk Tier", inmate.bunk)
                            DossierField("Work Detail", inmate.workDetail ?: "No assigned detail")
                            DossierField("Custody Status", inmate.custodyStatus.name)
                        }
                        3 -> {
                            // Medical & Psychiatric
                            DossierField("Suicide Watch Directive", if (inmate.suicideWatch) "ACTIVE (15-min checks)" else "Standard Housing")
                            DossierField("Medical Flags / Allergies", if (inmate.medicalAlerts.isNotEmpty()) inmate.medicalAlerts.joinToString("; ") else "None recorded")
                            DossierField("Gang Affiliation Intel", inmate.gangAffiliation)
                            DossierField("Supervision Notes", inmate.notes)
                        }
                    }
                }

                // Footer
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate950)
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.End
                ) {
                    Button(
                        onClick = { viewModel.closeDossier() },
                        colors = ButtonDefaults.buttonColors(containerColor = Slate800, contentColor = Slate200)
                    ) {
                        Text("Close Dossier")
                    }
                }
            }
        }
    }
}

@Composable
fun DossierField(label: String, value: String) {
    Column {
        Text(label.uppercase(), color = Slate400, fontSize = 10.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
        Text(value, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Medium)
        Spacer(modifier = Modifier.height(4.dp))
    }
}
```

---

## 13. Muster & Headcount Roll Call Screen (`HeadcountScreen.kt`)

### `app/src/main/java/com/ironwood/pims/ui/screens/HeadcountScreen.kt`
```kotlin
package com.ironwood.pims.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ironwood.pims.ui.theme.*
import com.ironwood.pims.ui.viewmodel.PrisonViewModel

@Composable
fun HeadcountScreen(viewModel: PrisonViewModel) {
    val headcount by viewModel.headcount.collectAsState()
    var certifyingOfficer by remember { mutableStateOf("Capt. J. Miller (#101)") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Shift Header Card
        Surface(
            color = Slate900,
            shape = RoundedCornerShape(8.dp),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate800))
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(headcount?.shift ?: "Morning Muster (06:00)", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("SCHEDULED MUSTER · TARGET: ${headcount?.censusTarget ?: 0}", color = Amber400, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }

                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = if (headcount?.status == "Reconciled") Emerald950 else if (headcount?.status == "Emergency Discrepancy") Red950 else Amber950,
                        border = CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(
                                if (headcount?.status == "Reconciled") Emerald500 else if (headcount?.status == "Emergency Discrepancy") Red500 else Amber500
                            )
                        )
                    ) {
                        Text(
                            headcount?.status ?: "In Progress",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            color = if (headcount?.status == "Reconciled") Emerald400 else if (headcount?.status == "Emergency Discrepancy") Red400 else Amber400,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))
                val progress = if ((headcount?.censusTarget ?: 0) > 0) {
                    (headcount?.verifiedTotal?.toFloat() ?: 0f) / headcount!!.censusTarget
                } else 0f

                LinearProgressIndicator(
                    progress = { progress.coerceIn(0f, 1f) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp),
                    color = if (headcount?.unaccountedCount ?: 0 > 0) Red500 else Emerald500,
                    trackColor = Slate800
                )
            }
        }

        // Verification Checklist
        Text("INMATE CENSUS VERIFICATION", color = Slate400, fontSize = 11.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(headcount?.inmateVerifications ?: emptyList()) { item ->
                Surface(
                    color = Slate900,
                    shape = RoundedCornerShape(6.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Slate800))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(item.inmateName, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("Cell: ${item.cellNumber} (${item.cellBlock.name})", color = Slate400, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            if (!item.verified) {
                                Button(
                                    onClick = { viewModel.verifyHeadcount(item.inmateId, true) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Emerald950, contentColor = Emerald400),
                                    shape = RoundedCornerShape(4.dp),
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text("Verify", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                                Button(
                                    onClick = { viewModel.flagUnaccounted(item.inmateId, true) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Red950, contentColor = Red400),
                                    shape = RoundedCornerShape(4.dp),
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Text("Flag Missing", fontSize = 11.sp)
                                }
                            } else {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Emerald400, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Verified", color = Emerald400, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Supervisor Certification Signoff
        Button(
            onClick = { viewModel.certifyCount(certifyingOfficer) },
            colors = ButtonDefaults.buttonColors(containerColor = Amber400, contentColor = Slate950),
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Certify & Sign Off Muster", fontWeight = FontWeight.Bold)
        }
    }
}
```

---

## 14. Printable Custody Jacket Summary (`PrintJacketDialog.kt`)

### `app/src/main/java/com/ironwood/pims/ui/dialogs/PrintJacketDialog.kt`
```kotlin
package com.ironwood.pims.ui.dialogs

import android.content.Context
import android.print.PrintAttributes
import android.print.PrintManager
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Print
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.ironwood.pims.data.model.Inmate
import com.ironwood.pims.ui.viewmodel.PrisonViewModel

@Composable
fun PrintJacketDialog(inmate: Inmate, viewModel: PrisonViewModel) {
    val context = LocalContext.current

    Dialog(
        onDismissRequest = { viewModel.closePrintJacket() },
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.92f),
            shape = RoundedCornerShape(8.dp),
            color = Color.White
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // Top Action Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        "STATE DEPARTMENT OF CORRECTIONS",
                        color = Color.DarkGray,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = { viewModel.closePrintJacket() }) {
                        Icon(Icons.Default.Close, contentDescription = null, tint = Color.Black)
                    }
                }

                Text(
                    "IRONWOOD STATE CORRECTIONAL FACILITY",
                    color = Color.Black,
                    fontWeight = FontWeight.Black,
                    fontSize = 18.sp
                )
                Text(
                    "OFFICIAL INMATE BOOKING JACKET & CUSTODY RECORD",
                    color = Color.Black,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = Color.Black, thickness = 2.dp)
                Spacer(modifier = Modifier.height(14.dp))

                // Offender Summary
                Text("CUSTODY ID: ${inmate.id}", color = Color.Black, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace, fontSize = 14.sp)
                Text("NAME: ${inmate.lastName.uppercase()}, ${inmate.firstName.uppercase()} ${inmate.middleName?.uppercase() ?: ""}", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text("SID NUMBER: ${inmate.stateIdNumber} · BOOKING: ${inmate.bookingNumber}", color = Color.DarkGray, fontFamily = FontFamily.Monospace, fontSize = 11.sp)
                Text("SECURITY CLASSIFICATION: ${inmate.securityLevel.name.uppercase()}", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                Text("HOUSING LOCATION: ${inmate.cellBlock.name} / CELL ${inmate.cellNumber} (${inmate.bunk} Bunk)", color = Color.Black, fontSize = 12.sp)

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = Color.LightGray)
                Spacer(modifier = Modifier.height(14.dp))

                // Biometrics
                Text("BIOMETRIC IDENTIFIERS", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                Text("Height: ${inmate.biometrics.height} | Weight: ${inmate.biometrics.weight} | Blood: ${inmate.biometrics.bloodType}", color = Color.DarkGray, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                Text("Scars/Tattoos: ${inmate.biometrics.scarsAndTattoos}", color = Color.DarkGray, fontSize = 11.sp)

                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = Color.LightGray)
                Spacer(modifier = Modifier.height(14.dp))

                // Legal Charges Table
                Text("JUDICIAL CHARGES & CONVICTIONS", color = Color.Black, fontWeight = FontWeight.Bold, fontSize = 12.sp, fontFamily = FontFamily.Monospace)
                inmate.charges.forEach { charge ->
                    Text("• ${charge.code} - ${charge.title} (${charge.sentenceYears} Yrs, ${charge.felonyClass})", color = Color.Black, fontSize = 12.sp)
                }

                Spacer(modifier = Modifier.height(24.dp))
                // Signatures
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        HorizontalDivider(modifier = Modifier.width(140.dp), color = Color.Black)
                        Text("RECEIVING OFFICER", fontSize = 10.sp, color = Color.Black, fontFamily = FontFamily.Monospace)
                    }
                    Column {
                        HorizontalDivider(modifier = Modifier.width(140.dp), color = Color.Black)
                        Text("WARDEN / WATCH CMDR", fontSize = 10.sp, color = Color.Black, fontFamily = FontFamily.Monospace)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
                Button(
                    onClick = { viewModel.closePrintJacket() },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Black, contentColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Done / Close Document")
                }
            }
        }
    }
}
```

---

## 15. Other Core Domain Screens & Dialogs

### `app/src/main/java/com/ironwood/pims/ui/screens/HousingMapScreen.kt`
- Renders Block A, Block B, Block C, Block D (Segregation), and Ward M (Infirmary) as an interactive grid.
- Displays capacity vs occupied status, cell status (`Operational`, `Maintenance`, `Quarantine`).
- Has a **Transfer Inmate Cell** button with security class compatibility checks (preventing Maximum custody from transferring directly to Minimum Block A).

### `app/src/main/java/com/ironwood/pims/ui/screens/IncidentsScreen.kt`
- Displays disciplinary reports and contraband seizures with category and severity badges.
- Includes **File Incident Report** and **Adjudicate Sanctions** actions.

### `app/src/main/java/com/ironwood/pims/ui/screens/VisitorsScreen.kt`
- Manages scheduled visitor appointments, attorney consultations, and family visits.
- Interactive actions: **Contraband Screening Check**, **Check In**, **Check Out**, **Deny Entry**.

### `app/src/main/java/com/ironwood/pims/ui/screens/MedicalWardScreen.kt`
- Medication Administration Record (MAR).
- Features daily pill pass queue with **Dispense & Sign** buttons for correctional nurses.

### `app/src/main/java/com/ironwood/pims/ui/screens/StaffRosterScreen.kt`
- Staff officers on duty, post assignments (Towers, Tiers, Gate Sallyports), tactical radio frequencies (`TAC-1`, `TAC-2`, `TAC-3`), and status toggles.

### `app/src/main/java/com/ironwood/pims/ui/dialogs/BookingIntakeDialog.kt`
- 4-step wizard for intake of new offenders into the correctional facility with suicide risk assessment and AFIS biometrics.

### `app/src/main/java/com/ironwood/pims/ui/dialogs/LockdownDialog.kt`
- Security alert switcher (`Normal Operations`, `Elevated Precaution`, `Cellblock Lockdown`, `Facility Full Lockdown`) enforcing institution-wide commands.

---

## 16. Step-by-Step Instructions for the Target AI Agent

When instructed to generate or recreate this application inside Android Studio or an Android project directory:

1. **Initialize Project Structure**:
   - Create the standard Android directory tree `app/src/main/java/com/ironwood/pims/` and `app/src/main/res/`.
   - Write `settings.gradle.kts`, root `build.gradle.kts`, and `app/build.gradle.kts` with KSP, Room, and Compose enabled.
2. **Setup Manifest & Resources**:
   - Write `AndroidManifest.xml` with `PimsApplication` and `MainActivity`.
   - Setup `strings.xml`, `colors.xml`, and `themes.xml`.
3. **Generate Domain Models & Room Entities**:
   - Place `PrisonModels.kt` and `Converters.kt` in `data/model/`.
   - Write `PimsDao.kt` and `PimsDatabase.kt` in `data/local/`.
   - Implement `MockData.kt` in `data/seed/` with the pre-seeded inmates, housing blocks, and incidents.
4. **Build Repositories & ViewModel**:
   - Implement `PrisonRepository.kt` and `PrisonRepositoryImpl.kt`.
   - Create `PrisonViewModel.kt` and `PrisonViewModelFactory.kt`.
5. **Implement Jetpack Compose UI**:
   - Create the theme in `ui/theme/` (Dark institutional palette: `Slate950`, `Slate900`, `Amber400`).
   - Implement `TopCommandBar.kt` and all 8 main screens (`DashboardScreen.kt`, `InmatesRosterScreen.kt`, `HeadcountScreen.kt`, `HousingMapScreen.kt`, `IncidentsScreen.kt`, `VisitorsScreen.kt`, `MedicalWardScreen.kt`, `StaffRosterScreen.kt`).
   - Implement modals (`InmateDossierDialog.kt`, `BookingIntakeDialog.kt`, `LockdownDialog.kt`, `PrintJacketDialog.kt`).
6. **Compile & Verification**:
   - Run `./gradlew assembleDebug` to verify complete build success.
   - Run `./gradlew test` to ensure DAOs and repositories pass unit checks.
