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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Propiedades</h1>
          <p className="text-gray-600 mt-1">
            Administra todas las propiedades del sistema
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin/properties/new')}
          className="bg-[#FF385C] hover:bg-[#E31C5F]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Propiedad
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ubicación, título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Propiedades</CardTitle>
          <CardDescription>
            {total > 0 ? `${total} propiedades encontradas` : 'No hay propiedades'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF385C]" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No se encontraron propiedades</p>
              <Button
                onClick={() => router.push('/admin/properties/new')}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Propiedad
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Huéspedes</TableHead>
                      <TableHead>Calificación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          <div className="w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={property.images?.[0] || '/placeholder.jpg'}
                              alt={property.title || 'Propiedad sin título'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg';
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate">{property.title || 'Sin título'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {property.location?.city || 'N/A'}, {property.location?.country || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {property.roomType || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatPrice(property.pricing?.basePrice || 0, property.pricing?.currency || 'EUR')}
                        </TableCell>
                        <TableCell>{property.capacity?.guests || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {property.rating?.overall?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({property.rating?.reviewCount || 0})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link 
                              href={`/propiedad/${property.id}`}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                              title="Ver detalles de la propiedad"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link 
                              href={`/admin/properties/${property.id}/edit`}
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                              title="Editar propiedad"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {total > perPage && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Mostrando {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, total)} de {total}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage * perPage >= total}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

