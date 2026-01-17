import React, { useState, useEffect } from 'react';
import { APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, CheckCircle, XCircle, Loader } from 'lucide-react';
import { logSessionStart } from '@/lib/analytics';
import type { SafeZone, UserLocation } from '@/types';

// Ahmedabad city center coordinates
const AHMEDABAD_CENTER = { lat: 23.0225, lng: 72.5714 };

// Major colleges in Ahmedabad  with real coordinates
const AHMEDABAD_COLLEGES: SafeZone[] = [
    {
        id: '1',
        name: 'Gujarat University',
        description: 'Main campus of Gujarat University',
        location: { lat: 23.0356, lng: 72.5063 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
    {
        id: '2',
        name: 'IIM Ahmedabad',
        description: 'Indian Institute of Management',
        location: { lat: 23.1160, lng: 72.5397 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '22:00' },
    },
    {
        id: '3',
        name: 'CEPT University',
        description: 'Centre for Environmental Planning and Technology',
        location: { lat: 23.0387, lng: 72.5490 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '20:00' },
    },
    {
        id: '4',
        name: 'PDPU (Pandit Deendayal Energy University)',
        description: 'Energy and Technology University',
        location: { lat: 23.1732, lng: 72.6429 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '20:00' },
    },
    {
        id: '5',
        name: 'Nirma University',
        description: 'Institute of Technology and Science',
        location: { lat: 23.1283, lng: 72.5446 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '20:00' },
    },
    {
        id: '6',
        name: 'LD College of Engineering',
        description: 'Leading engineering college',
        location: { lat: 23.0274, lng: 72.5258 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
    {
        id: '7',
        name: 'Ahmedabad University',
        description: 'Liberal arts and sciences university',
        location: { lat: 23.1722, lng: 72.6431 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '20:00' },
    },
    {
        id: '8',
        name: 'Sardar Patel University',
        description: 'Vallabh Vidyanagar campus',
        location: { lat: 22.5518, lng: 72.9263 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
    {
        id: '9',
        name: 'Karnavati University',
        description: 'Modern multidisciplinary university',
        location: { lat: 23.1225, lng: 72.5430 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '20:00' },
    },
    {
        id: '10',
        name: 'GLS University',
        description: 'Gujarat Law Society University',
        location: { lat: 23.0321, lng: 72.5409 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
    {
        id: '11',
        name: 'Silver Oak University',
        description: 'Engineering and Technology',
        location: { lat: 23.0097, lng: 72.5024 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
    {
        id: '12',
        name: 'National Institute of Design (NID)',
        description: 'Premier design institution',
        location: { lat: 23.0243, lng: 72.5152 },
        radius: 100,
        type: 'campus',
        openHours: { open: '09:00', close: '18:00' },
    },
    {
        id: '13',
        name: 'Ganpat University',
        description: 'Multi-faculty university',
        location: { lat: 23.4283, lng: 72.5595 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
    {
        id: '14',
        name: 'Aditya Silver Oak Institute',
        description: 'Engineering college',
        location: { lat: 23.0134, lng: 72.5024 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
    {
        id: '15',
        name: 'Indus University',
        description: 'Modern private university',
        location: { lat: 23.0799, lng: 72.5052 },
        radius: 100,
        type: 'campus',
        openHours: { open: '08:00', close: '18:00' },
    },
];

// Calculate distance between two coordinates in meters
function calculateDistance(
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (loc1.lat * Math.PI) / 180;
    const φ2 = (loc2.lat * Math.PI) / 180;
    const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

export default function MapPage() {
    const [safeZones] = useState<SafeZone[]>(AHMEDABAD_COLLEGES);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [nearestZone, setNearestZone] = useState<SafeZone | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [locationError, setLocationError] = useState('');
    const [mapCenter, setMapCenter] = useState(AHMEDABAD_CENTER);

    // Get user's location
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location: UserLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    };
                    setUserLocation(location);
                    setMapCenter(location);
                    findNearestZone(location);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setLocationError('Unable to get your location. Showing Ahmedabad colleges.');
                    // Use Ahmedabad center as default
                    const defaultLocation: UserLocation = AHMEDABAD_CENTER;
                    setUserLocation(defaultLocation);
                    findNearestZone(defaultLocation);
                }
            );
        } else {
            setLocationError('Geolocation is not supported by your browser');
        }
    }, []);

    // Find nearest safe zone
    const findNearestZone = (location: UserLocation) => {
        let nearest: SafeZone | null = null;
        let minDistance = Infinity;

        safeZones.forEach((zone) => {
            const dist = calculateDistance(location, zone.location);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = zone;
            }
        });

        setNearestZone(nearest);
        setDistance(minDistance);
    };

    const isWithinGeofence = distance !== null && nearestZone && distance <= nearestZone.radius;

    const handleStartSession = () => {
        if (!nearestZone) return;

        logSessionStart('mock-session-id', nearestZone.name);
        alert(`Session started at ${nearestZone.name}! (Mock implementation)`);
    };

    const handleCenterOnUser = () => {
        if (userLocation) {
            setMapCenter(userLocation);
        }
    };

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8">
                <div className="card max-w-2xl p-8 text-center">
                    <MapPin size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Google Maps API Key Required
                    </h2>
                    <p className="text-gray-600 mb-4">
                        To use the Safe Zone Map feature, please add your Google Maps API key to the{' '}
                        <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded-lg text-left text-sm overflow-x-auto">
                        VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
                    </pre>
                    <p className="text-gray-500 text-sm mt-4">
                        Get your API key from the{' '}
                        <a
                            href="https://console.cloud.google.com/google/maps-apis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:underline"
                        >
                            Google Cloud Console
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[calc(100vh-4rem)]">
            {/* Map */}
            <APIProvider apiKey={apiKey}>
                <GoogleMap
                    center={mapCenter}
                    zoom={12}
                    mapId="skillswitch-map"
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Safe Zone Markers - All Ahmedabad Colleges */}
                    {safeZones.map((zone) => (
                        <Marker
                            key={zone.id}
                            position={zone.location}
                            title={zone.name}
                        />
                    ))}

                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            title="Your Location"
                        />
                    )}
                </GoogleMap>
            </APIProvider>

            {/* Control Panel */}
            <div className="absolute top-4 left-4 right-4 md:right-auto md:w-96 space-y-4">
                {/* Info Banner */}
                <div className="card-glass p-4 bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                        📍 Showing {safeZones.length} colleges in Ahmedabad as Safe Zones
                    </p>
                </div>

                {/* Location Error */}
                {locationError && (
                    <div className="card-glass p-4 bg-yellow-50 border border-yellow-200">
                        <p className="text-sm text-yellow-800">{locationError}</p>
                    </div>
                )}

                {/* Nearest Zone Info */}
                <div className="card-glass p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin size={24} className="text-primary-600" />
                        Nearest College
                    </h2>

                    {nearestZone ? (
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900">{nearestZone.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{nearestZone.description}</p>

                            {nearestZone.openHours && (
                                <p className="text-sm text-gray-700 mb-3">
                                    <strong>Hours:</strong> {nearestZone.openHours.open} - {nearestZone.openHours.close}
                                </p>
                            )}

                            {/* Distance Indicator */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Distance</span>
                                    <span className="text-lg font-bold text-primary-600">
                                        {distance !== null ? `${Math.round(distance)}m` : '---'}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${isWithinGeofence ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                        style={{
                                            width: distance
                                                ? `${Math.min((nearestZone.radius / Math.max(distance, nearestZone.radius)) * 100, 100)}%`
                                                : '0%',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Geofence Status */}
                            <div className={`p-3 rounded-lg mb-4 ${isWithinGeofence ? 'bg-green-50' : 'bg-red-50'}`}>
                                <div className="flex items-center gap-2">
                                    {isWithinGeofence ? (
                                        <>
                                            <CheckCircle size={20} className="text-green-600" />
                                            <span className="text-sm font-semibold text-green-700">
                                                Within Safe Zone ({nearestZone.radius}m)
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={20} className="text-red-600" />
                                            <span className="text-sm font-semibold text-red-700">
                                                Outside Safe Zone (need within {nearestZone.radius}m)
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Start Session Button */}
                            <button
                                onClick={handleStartSession}
                                disabled={!isWithinGeofence}
                                className={`btn-primary w-full ${!isWithinGeofence ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isWithinGeofence ? 'Start Session' : 'Move Closer to Start'}
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-500">Finding nearest college...</p>
                    )}
                </div>

                {/* Center on User Button */}
                <button
                    onClick={handleCenterOnUser}
                    className="card-glass p-4 w-full flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                >
                    <Navigation size={20} className="text-primary-600" />
                    <span className="font-medium text-gray-900">Center on My Location</span>
                </button>
            </div>
        </div>
    );
}
