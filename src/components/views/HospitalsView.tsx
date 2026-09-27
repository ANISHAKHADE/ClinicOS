import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Star,
  AlertTriangle,
  Activity,
  Clock,
  Compass,
} from 'lucide-react';
import { Hospital } from '../../types';
import { Input } from '../ui/Input';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

interface HospitalsViewProps {
  hospitals: Hospital[];
}

const HOSPITAL_TYPES = ['All', 'Government', 'Private', 'Clinic', 'Specialty'];

export function HospitalsView({ hospitals }: HospitalsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        h.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'All' || h.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [hospitals, searchTerm, typeFilter]);

  const stats = {
    total: hospitals.length,
    emergency: hospitals.filter((h) => h.emergency_available === 1).length,
    icu: hospitals.filter((h) => h.icu_available === 1).length,
    avgDistance:
      hospitals.length > 0
        ? (hospitals.reduce((acc, h) => acc + h.distance_km, 0) / hospitals.length).toFixed(1)
        : '0',
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-teal-600" />
            Hospital & Referral Facility Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Regional healthcare directory across Pune with trauma and ICU preparedness status
          </p>
        </div>
      </div>

      {/* Facilities Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Hospitals</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">24/7 Trauma/Emergency</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">
              {stats.emergency}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">ICU Beds Available</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">
              {stats.icu}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Avg Radial Distance</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 mt-1">
              {stats.avgDistance} km
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search hospital name, clinical specialty (e.g. Cardiology, Trauma), or area..."
              className="pl-9 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 self-center"
            >
              Clear
            </button>
          )}
        </div>

        {/* Hospital Type Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500 mr-2">Facility Category:</span>
          {HOSPITAL_TYPES.map((type) => {
            const isSelected = typeFilter === type;
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hospitals Grid */}
      {filteredHospitals.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No hospitals found matching filters"
          description="Try broadening your search keywords or switching category."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHospitals.map((hospital) => (
            <Card
              key={hospital.id}
              className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 leading-snug">
                        {hospital.name}
                      </h3>
                      <Badge
                        variant={
                          hospital.type === 'Government'
                            ? 'info'
                            : hospital.type === 'Specialty'
                            ? 'purple'
                            : 'default'
                        }
                      >
                        {hospital.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{hospital.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">/ 5.0 Clinical Quality</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 bg-teal-50 dark:bg-teal-950/50 p-2.5 rounded-xl border border-teal-100 dark:border-teal-900/60">
                    <div className="text-xl font-black text-teal-700 dark:text-teal-300 font-mono">
                      {hospital.distance_km}
                    </div>
                    <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                      km radial
                    </div>
                  </div>
                </div>

                {/* Address and Phone */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>
                      {hospital.address}, {hospital.city}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <a href={`tel:${hospital.phone}`} className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      {hospital.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>OPD & Casualties: {hospital.operating_hours}</span>
                  </p>
                </div>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {hospital.emergency_available === 1 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      24/7 Trauma Emergency
                    </span>
                  )}
                  {hospital.icu_available === 1 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      <Activity className="w-3.5 h-3.5" />
                      ICU Beds Active
                    </span>
                  )}
                </div>

                {/* Specialties Tags */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Specialized Departments
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {hospital.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
