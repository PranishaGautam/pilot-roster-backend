"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AircraftTableColumns = exports.RouteTableColumns = exports.PilotTableColumns = exports.UserTableColumns = void 0;
// Defining columns for the 'user' table
exports.UserTableColumns = {
    userId: 'id',
    firstName: 'first_name',
    lastName: 'last_name',
    userEmail: 'email',
    userPassword: 'password',
    userRole: 'role',
    startDate: 'start_date',
    endDate: 'end_date'
};
exports.PilotTableColumns = {
    pilotId: 'pilot_id',
    licenseNumber: 'license_no',
    licenseSpecifications: 'license_specs',
    yearsOfExperience: 'experience_in_yrs',
    userId: 'user_id'
};
exports.RouteTableColumns = {
    routeId: 'route_id',
    routeOrigin: 'origin',
    routeDestination: 'destination',
    routeDistanceInKm: 'distance_km',
    routeMetadata: 'metadata'
};
exports.AircraftTableColumns = {
    aircraftId: 'aircraft_id',
    aircraftName: 'name',
    aircraftModel: 'model',
    aircraftSpecifications: 'specifications'
};
