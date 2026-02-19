// app/admin/properties/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyService, CreatePropertyData } from '@/lib/properties/property-service';
import { Property } from '@/types/search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Página de Administración de Propiedades
 * Permite listar, buscar, crear, editar y ver propiedades
 */
export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  useEffect(() => {
    loadProperties();
  }, [currentPage, searchQuery]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const response = await PropertyService.searchProperties({
        query: searchQuery ? { location: searchQuery } : {},
        filters: {},
        sortBy: 'recommended',
        page: currentPage,
        perPage: perPage,
      });

      if (response.success && response.data) {
        setProperties(response.data.properties);
        setTotal(response.data.total);
      } else {
        toast.error(response.error?.message || 'Error al cargar propiedades');
        setProperties([]);
      }
    } catch (error) {
      console.error('Error cargando propiedades:', error);
      toast.error('Error al cargar propiedades');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProperties();
  };

  const formatPrice = (price: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const cardStyle = {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(8px)',
  };

  return (
    <div className="p-5 md:p-8 min-h-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-admin-accent uppercase tracking-[0.15em] mb-1">Inventario</p>
          <h1 className="text-2xl md:text-3xl font-black text-texto-100 tracking-tight">Gestión de Propiedades</h1>
          <p className="text-[#64748b] text-sm mt-1">Administra todas las propiedades del sistema</p>
        </div>
        <button
          onClick={() => router.push('/admin/properties/new')}
          className="flex items-center gap-2 bg-admin-accent hover:bg-admin-accent-hover text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-admin-accent/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nueva Propiedad
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-4" style={cardStyle}>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] w-4 h-4" />
            <input
              placeholder="Buscar por ubicación, título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1e293b]/60 border border-[#1e293b] text-texto-100 placeholder-[#475569] text-sm focus:outline-none focus:border-admin-accent/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#1e293b] border border-[#1e293b] text-sm font-semibold text-[#94a3b8] hover:text-texto-100 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
        </form>
      </div>

      {/* Properties Grid */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-5 py-4 border-b border-[#1e293b]/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-texto-100">Propiedades</h2>
          <span className="text-xs text-[#64748b]">
            {total > 0 ? `${total} encontradas` : 'Sin propiedades'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(30,41,59,0.6)' }}>
                <div className="aspect-video bg-[#1e293b]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#1e293b] rounded w-3/4" />
                  <div className="h-3 bg-[#1e293b] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#64748b] text-sm mb-4">No se encontraron propiedades</p>
            <button
              onClick={() => router.push('/admin/properties/new')}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-[#1e293b] text-sm font-semibold text-[#94a3b8] hover:text-texto-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Primera Propiedad
            </button>
          </div>
        ) : (
          <>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="group relative rounded-2xl overflow-hidden border border-[#1e293b]/60 hover:border-admin-accent/30 transition-all duration-300"
                  style={{ background: 'rgba(15, 23, 42, 0.6)' }}
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={property.images?.[0] || '/placeholder.jpg'}
                      alt={property.title || 'Propiedad'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Link
                        href={`/propiedad/${property.id}`}
                        className="w-10 h-10 rounded-xl bg-admin-accent flex items-center justify-center text-white hover:bg-admin-accent-hover transition-colors shadow-lg"
                        title="Ver propiedad"
                        aria-label={`Ver propiedad ${property.title || ''}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="w-10 h-10 rounded-xl bg-[#1e293b] border border-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-texto-100 transition-colors shadow-lg"
                        title="Editar"
                        aria-label={`Editar propiedad ${property.title || ''}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#020617]/80 backdrop-blur-sm text-[#94a3b8]">
                        {property.roomType || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-[13px] font-bold text-texto-100 truncate mb-1">
                      {property.title || 'Sin título'}
                    </h3>
                    <p className="text-[12px] text-[#64748b] mb-3">
                      {property.location?.city || 'N/A'}, {property.location?.country || 'N/A'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-[11px]">★</span>
                        <span className="text-[12px] font-semibold text-texto-100">
                          {property.rating?.overall?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-[11px] text-[#475569]">
                          ({property.rating?.reviewCount || 0})
                        </span>
                      </div>
                      <span className="text-[13px] font-bold text-admin-accent">
                        {formatPrice(property.pricing?.basePrice || 0, property.pricing?.currency || 'EUR')}
                        <span className="text-[10px] font-normal text-[#475569]">/noche</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > perPage && (
              <div className="px-5 py-4 border-t border-[#1e293b]/60 flex items-center justify-between">
                <p className="text-xs text-[#64748b]">
                  Mostrando {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, total)} de {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-[#1e293b] border border-[#1e293b] text-xs font-semibold text-[#94a3b8] hover:text-texto-100 disabled:opacity-40 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * perPage >= total}
                    className="px-3 py-1.5 rounded-lg bg-admin-accent text-xs font-semibold text-white hover:bg-admin-accent-hover disabled:opacity-40 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

