// Defining columns for the 'user' table
export const UserTableColumns = {
    userId: 'id',
    firstName: 'first_name',
    lastName: 'last_name',
    userEmail: 'email',
    userPassword: 'password',
    userRole: 'role',
    startDate: 'start_date',
    endDate: 'end_date'
}

export const PilotTableColumns = {
    pilotId: 'pilot_id',
    licenseNumber: 'license_no',
    licenseSpecifications: 'license_specs',
    yearsOfExperience: 'experience_in_yrs',
    userId: 'user_id'
}

export const RouteTableColumns = {
    routeId: 'route_id',
    routeOrigin: 'origin',
    routeDestination: 'destination',
    routeDistanceInKm: 'distance_km',
    routeMetadata: 'metadata' 
}

export const AircraftTableColumns = {
    aircraftId: 'aircraft_id',
    aircraftName: 'name',
    aircraftModel: 'model',
    aircraftSpecifications: 'specifications'
}