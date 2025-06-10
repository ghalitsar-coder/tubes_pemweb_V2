# System Flowchart Documentation
## Project Management System - Flow Diagrams

### 1. System Architecture Flowchart

```mermaid
graph TD
    A[User Access] --> B{Authentication}
    B -->|Login Success| C[Dashboard]
    B -->|Login Failed| D[Login Page]
    D --> B
    
    C --> E{User Role}
    E -->|Admin| F[Admin Dashboard]
    E -->|Project Manager| G[PM Dashboard] 
    E -->|Team Member| H[Member Dashboard]
    
    F --> I[User Management]
    F --> J[All Projects]
    F --> K[System Settings]
    
    G --> L[Create Projects]
    G --> M[Manage Projects]
    G --> N[Assign Tasks]
    
    H --> O[View Assigned Tasks]
    H --> P[Update Task Status]
    H --> Q[View Projects]
    
    I --> R[CRUD Users]
    J --> S[CRUD Projects]
    L --> T[Project Creation Form]
    M --> U[Project Management]
    N --> V[Task Assignment]
    O --> W[Task List]
    P --> X[Task Updates]
    Q --> Y[Project View]
    
    S --> Z[Database Operations]
    T --> Z
    U --> Z
    V --> Z
    W --> Z
    X --> Z
    Y --> Z
    R --> Z
```

### 2. User Authentication & Authorization Flow

```mermaid
graph TD
    A[User Accesses System] --> B[Login Page]
    B --> C[Submit Credentials]
    C --> D{Valid Credentials?}
    
    D -->|No| E[Show Error Message]
    E --> B
    
    D -->|Yes| F[Create Session]
    F --> G[Load User Permissions]
    G --> H{Check User Role}
    
    H -->|Admin| I[Full System Access]
    H -->|Project Manager| J[Project & Task Management]
    H -->|Team Member| K[Limited Task Access]
    
    I --> L[Admin Features]
    J --> M[PM Features]
    K --> N[Member Features]
    
    L --> O[Dashboard Redirect]
    M --> O
    N --> O
    
    O --> P[User Dashboard]
    P --> Q[Route Protection Check]
    Q --> R{Has Permission?}
    
    R -->|Yes| S[Access Granted]
    R -->|No| T[Access Denied]
    
    S --> U[Feature Access]
    T --> V[Error Page]
```

### 3. Project Management Workflow

```mermaid
graph TD
    A[Project Request] --> B{User Role Check}
    B -->|Admin/PM| C[Project Creation Form]
    B -->|Team Member| D[Access Denied]
    
    C --> E[Fill Project Details]
    E --> F[Set Budget & Timeline]
    F --> G[Add Team Members]
    G --> H[Submit Project]
    
    H --> I{Validation}
    I -->|Failed| J[Show Errors]
    J --> E
    
    I -->|Success| K[Create Project in DB]
    K --> L[Project Created]
    
    L --> M[Project Dashboard]
    M --> N[Task Management]
    M --> O[Team Management]
    M --> P[Progress Tracking]
    M --> Q[Budget Monitoring]
    
    N --> R[Create Tasks]
    R --> S[Assign to Users]
    S --> T[Set Deadlines]
    T --> U[Task Created]
    
    O --> V[Add Members]
    V --> W[Set Permissions]
    W --> X[Member Added]
    
    P --> Y[Update Progress]
    Y --> Z[Status Reports]
    
    Q --> AA[Track Expenses]
    AA --> BB[Budget Analytics]
```

### 4. Task Management Flow

```mermaid
graph TD
    A[Task Creation Request] --> B{Permission Check}
    B -->|Has Permission| C[Task Form]
    B -->|No Permission| D[Access Denied]
    
    C --> E[Fill Task Details]
    E --> F[Select Project]
    F --> G[Assign User]
    G --> H[Set Priority]
    H --> I[Set Deadline]
    I --> J[Add Attachments]
    J --> K[Submit Task]
    
    K --> L{Validation}
    L -->|Failed| M[Show Errors]
    M --> E
    
    L -->|Success| N[Create Task in DB]
    N --> O[Task Created]
    
    O --> P[Task Dashboard]
    P --> Q[Task Status]
    Q --> R{Current Status}
    
    R -->|Todo| S[Start Task]
    R -->|In Progress| T[Continue Work]
    R -->|On Hold| U[Resume Task]
    R -->|Completed| V[Task Finished]
    
    S --> W[Update to In Progress]
    T --> X[Add Comments]
    T --> Y[Upload Files]
    T --> Z[Update Progress]
    
    U --> AA[Change Status]
    AA --> T
    
    W --> T
    X --> BB[Comment Saved]
    Y --> CC[File Uploaded]
    Z --> DD[Progress Updated]
    
    BB --> EE[Notification Sent]
    CC --> EE
    DD --> EE
    
    V --> FF[Mark Complete]
    FF --> GG[Update Project Progress]
```

### 5. Comment System Flow

```mermaid
graph TD
    A[User Wants to Comment] --> B{On What?}
    B -->|Project| C[Project Comment Form]
    B -->|Task| D[Task Comment Form]
    B -->|Attachment| E[Attachment Comment Form]
    
    C --> F[Write Project Comment]
    D --> G[Write Task Comment]
    E --> H[Write Attachment Comment]
    
    F --> I[Add Image?]
    G --> I
    H --> I
    
    I -->|Yes| J[Upload Image]
    I -->|No| K[Submit Comment]
    
    J --> L[Image Uploaded]
    L --> K
    
    K --> M{Validation}
    M -->|Failed| N[Show Error]
    N --> F
    
    M -->|Success| O[Save Comment]
    O --> P[Display Comment]
    
    P --> Q[Reply Option]
    Q --> R{User Replies?}
    
    R -->|Yes| S[Create Reply]
    R -->|No| T[End]
    
    S --> U[Nested Comment]
    U --> P
```

### 6. Calendar Events Flow

```mermaid
graph TD
    A[Calendar Access] --> B[Calendar View]
    B --> C{Event Action}
    
    C -->|Create| D[Event Creation Form]
    C -->|View| E[Event Details]
    C -->|Edit| F[Event Edit Form]
    C -->|Delete| G[Confirm Deletion]
    
    D --> H[Fill Event Details]
    H --> I[Set Date & Time]
    I --> J[Choose Event Type]
    J --> K[Link to Project/Task?]
    
    K -->|Yes| L[Select Project/Task]
    K -->|No| M[Submit Event]
    
    L --> M
    M --> N{Validation}
    
    N -->|Failed| O[Show Errors]
    O --> H
    
    N -->|Success| P[Create Event]
    P --> Q[Add to Calendar]
    
    E --> R[Show Event Info]
    R --> S[Action Options]
    
    F --> T[Update Event]
    T --> U[Save Changes]
    
    G --> V{Confirm?}
    V -->|Yes| W[Delete Event]
    V -->|No| X[Cancel]
    
    W --> Y[Remove from Calendar]
    X --> B
```

### 7. File Attachment Flow

```mermaid
graph TD
    A[Upload Request] --> B{File Selected?}
    B -->|No| C[File Selection]
    B -->|Yes| D[File Validation]
    
    C --> E[Choose File]
    E --> D
    
    D --> F{Valid File?}
    F -->|No| G[Show Error]
    G --> C
    
    F -->|Yes| H[Upload to Cloudinary]
    H --> I{Upload Success?}
    
    I -->|Failed| J[Upload Error]
    J --> G
    
    I -->|Success| K[Get File URL]
    K --> L[Save to Database]
    L --> M[Create Attachment Record]
    
    M --> N[Display File]
    N --> O[File Actions]
    
    O --> P{Action Type}
    P -->|View| Q[Open File]
    P -->|Download| R[Download File]
    P -->|Delete| S[Confirm Delete]
    P -->|Comment| T[Add Comment]
    
    S --> U{Confirm?}
    U -->|Yes| V[Delete File]
    U -->|No| W[Cancel]
    
    V --> X[Remove from DB]
    X --> Y[Remove from Storage]
    
    T --> Z[Comment Form]
    Z --> AA[Save Comment]
```

### 8. Permission System Flow

```mermaid
graph TD
    A[User Action Request] --> B[Get User Permissions]
    B --> C[Load User Roles]
    C --> D[Get Role Permissions]
    D --> E[Combine Permissions]
    
    E --> F{Required Permission}
    F -->|Admin Actions| G{Has Admin Role?}
    F -->|PM Actions| H{Has PM Role or Admin?}
    F -->|Member Actions| I{Has Any Role?}
    
    G -->|Yes| J[Allow Action]
    G -->|No| K[Deny Access]
    
    H -->|Yes| J
    H -->|No| K
    
    I -->|Yes| L{Resource Owner?}
    I -->|No| K
    
    L -->|Yes| J
    L -->|No| M{Assigned User?}
    
    M -->|Yes| J
    M -->|No| K
    
    J --> N[Execute Action]
    K --> O[Show Access Denied]
    
    N --> P[Log Action]
    O --> Q[Redirect to Safe Page]
```

### 9. Database Operation Flow

```mermaid
graph TD
    A[Application Request] --> B{Operation Type}
    
    B -->|Create| C[Insert Operation]
    B -->|Read| D[Select Operation]
    B -->|Update| E[Update Operation]
    B -->|Delete| F[Delete Operation]
    
    C --> G[Validate Data]
    D --> H[Check Permissions]
    E --> G
    F --> I[Check Constraints]
    
    G --> J{Valid?}
    J -->|No| K[Return Error]
    J -->|Yes| L[Execute Query]
    
    H --> M{Has Access?}
    M -->|No| N[Access Denied]
    M -->|Yes| L
    
    I --> O{Safe to Delete?}
    O -->|No| P[Constraint Error]
    O -->|Yes| L
    
    L --> Q{Success?}
    Q -->|No| R[Database Error]
    Q -->|Yes| S[Return Result]
    
    K --> T[Error Response]
    N --> T
    P --> T
    R --> T
    S --> U[Success Response]
```

### 10. System Integration Flow

```mermaid
graph TD
    A[Frontend Request] --> B[Laravel Router]
    B --> C[Middleware Stack]
    
    C --> D{Authentication}
    D -->|Failed| E[401 Unauthorized]
    D -->|Success| F[Authorization Check]
    
    F --> G{Permission}
    G -->|Denied| H[403 Forbidden]
    G -->|Allowed| I[Controller Action]
    
    I --> J[Service Layer]
    J --> K[Model Operations]
    K --> L[Database Query]
    
    L --> M{Query Success?}
    M -->|Failed| N[Database Error]
    M -->|Success| O[Process Result]
    
    O --> P[Format Response]
    P --> Q{Response Type}
    
    Q -->|API| R[JSON Response]
    Q -->|Web| S[Inertia Response]
    
    R --> T[Frontend Processing]
    S --> U[React Component]
    
    T --> V[Update UI]
    U --> V
    
    E --> W[Error Handling]
    H --> W
    N --> W
    
    W --> X[Display Error]
```

---

*Generated on: June 10, 2025*
*System: Project Management System*
*Documentation: Complete System Flowcharts*
