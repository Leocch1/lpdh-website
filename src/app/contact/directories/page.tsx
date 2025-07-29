export default function DirectoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">LPDH Directories</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Medical Staff Directory</h2>
            <p className="text-muted-foreground mb-4">
              Find our medical professionals and specialists.
            </p>
            {/* Add your medical staff directory content here */}
            <div className="space-y-2">
              <p className="text-sm">Coming soon...</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Department Directory</h2>
            <p className="text-muted-foreground mb-4">
              Browse our medical departments and services.
            </p>
            {/* Add your department directory content here */}
            <div className="space-y-2">
              <p className="text-sm">Coming soon...</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Administrative Staff</h2>
            <p className="text-muted-foreground mb-4">
              Contact our administrative personnel.
            </p>
            {/* Add your administrative staff content here */}
            <div className="space-y-2">
              <p className="text-sm">Coming soon...</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Emergency Contacts</h2>
            <p className="text-muted-foreground mb-4">
              Important emergency contact information.
            </p>
            <div className="space-y-2">
              <p className="font-semibold">Emergency Line: (09) 8825-5236</p>
              <p className="text-sm text-muted-foreground">24/7 Emergency Services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
