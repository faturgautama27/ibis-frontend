/**
 * Purchase Order Service Unit Tests
 * 
 * Tests CRUD operations, error handling, and retry logic
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PurchaseOrderService, CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from './purchase-order.service';
import { PurchaseOrderHeader, POStatus, InputMethod, POFilters, POLookupCriteria } from '../models/purchase-order.model';
import { environment } from '../../../../environments/environment';

describe('PurchaseOrderService', () => {
    let service: PurchaseOrderService;
    let httpMock: HttpTestingController;
    const apiUrl = `${environment.apiUrl}/purchase-orders`;

    const mockPurchaseOrder: PurchaseOrderHeader = {
        id: 'po-1',
        poNumber: 'PO-2024-001',
        poDate: new Date('2024-01-15'),
        supplierId: 'sup-1',
        supplierCode: 'SUP001',
        supplierName: 'Test Supplier',
        warehouseId: 'wh-1',
        warehouseCode: 'WH001',
        warehouseName: 'Main Warehouse',
        status: POStatus.PENDING,
        inputMethod: InputMethod.MANUAL,
        totalItems: 2,
        totalQuantity: 150,
        totalValue: 7500000,
        currency: 'IDR',
        createdAt: new Date('2024-01-15'),
        createdBy: 'user-1'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PurchaseOrderService]
        });
        service = TestBed.inject(PurchaseOrderService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('getOrders', () => {
        it('should retrieve all purchase orders', (done) => {
            const mockOrders = [mockPurchaseOrder];

            service.getOrders().subscribe(orders => {
                expect(orders).toEqual(mockOrders);
                expect(orders.length).toBe(1);
                done();
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('GET');
            req.flush(mockOrders);
        });

        it('should apply filters to query parameters', (done) => {
            const filters: POFilters = {
                status: [POStatus.PENDING],
                supplierId: 'sup-1',
                searchQuery: 'PO-2024'
            };

            service.getOrders(filters).subscribe(() => done());

            const req = httpMock.expectOne(request => {
                return request.url === apiUrl &&
                    request.params.has('status') &&
                    request.params.has('supplierId') &&
                    request.params.has('searchQuery');
            });
            expect(req.request.method).toBe('GET');
            req.flush([mockPurchaseOrder]);
        });

        it('should handle array filters correctly', (done) => {
            const filters: POFilters = {
                status: [POStatus.PENDING, POStatus.PARTIALLY_RECEIVED]
            };

            service.getOrders(filters).subscribe(() => done());

            const req = httpMock.expectOne(request => {
                const statusParams = request.params.getAll('status');
                return statusParams !== null &&
                    statusParams.length === 2 &&
                    statusParams.includes(POStatus.PENDING) &&
                    statusParams.includes(POStatus.PARTIALLY_RECEIVED);
            });
            req.flush([mockPurchaseOrder]);
        });
    });

    describe('getOrderById', () => {
        it('should retrieve a single purchase order by ID', (done) => {
            const orderId = 'po-1';

            service.getOrderById(orderId).subscribe(order => {
                expect(order).toEqual(mockPurchaseOrder);
                expect(order.id).toBe(orderId);
                done();
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
            expect(req.request.method).toBe('GET');
            req.flush(mockPurchaseOrder);
        });

        it('should handle 404 error when order not found', (done) => {
            const orderId = 'non-existent';

            service.getOrderById(orderId).subscribe({
                error: (error) => {
                    expect(error.message).toContain('not found');
                    done();
                }
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
            req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
        });
    });

    describe('getOrderDetails', () => {
        it('should retrieve order line items', (done) => {
            const orderId = 'po-1';
            const mockDetails = [
                {
                    id: 'detail-1',
                    purchaseOrderId: orderId,
                    lineNumber: 1,
                    itemId: 'item-1',
                    itemCode: 'RM001',
                    itemName: 'Raw Material A',
                    hsCode: '1234.56.78',
                    orderedQuantity: 100,
                    receivedQuantity: 0,
                    remainingQuantity: 100,
                    unit: 'pcs',
                    unitPrice: 50000,
                    totalPrice: 5000000
                }
            ];

            service.getOrderDetails(orderId).subscribe(details => {
                expect(details).toEqual(mockDetails);
                expect(details.length).toBe(1);
                done();
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}/details`);
            expect(req.request.method).toBe('GET');
            req.flush(mockDetails);
        });
    });

    describe('createOrder', () => {
        it('should create a new purchase order', (done) => {
            const createDto: CreatePurchaseOrderDto = {
                poNumber: 'PO-2024-001',
                poDate: new Date('2024-01-15'),
                supplierId: 'sup-1',
                warehouseId: 'wh-1',
                inputMethod: 'MANUAL',
                currency: 'IDR',
                details: [
                    {
                        lineNumber: 1,
                        itemId: 'item-1',
                        orderedQuantity: 100,
                        unit: 'pcs',
                        unitPrice: 50000
                    }
                ]
            };

            service.createOrder(createDto).subscribe(order => {
                expect(order).toEqual(mockPurchaseOrder);
                done();
            });

            const req = httpMock.expectOne(apiUrl);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(createDto);
            req.flush(mockPurchaseOrder);
        });

        it('should handle validation errors', (done) => {
            const createDto: CreatePurchaseOrderDto = {
                poNumber: '',
                poDate: new Date(),
                supplierId: '',
                warehouseId: '',
                inputMethod: 'MANUAL',
                currency: 'IDR',
                details: []
            };

            service.createOrder(createDto).subscribe({
                error: (error) => {
                    expect(error.message).toContain('Validation');
                    done();
                }
            });

            const req = httpMock.expectOne(apiUrl);
            req.flush(
                {
                    message: 'Validation failed',
                    details: [
                        { field: 'poNumber', message: 'PO Number is required' },
                        { field: 'supplierId', message: 'Supplier is required' }
                    ]
                },
                { status: 400, statusText: 'Bad Request' }
            );
        });
    });

    describe('updateOrder', () => {
        it('should update an existing purchase order', (done) => {
            const orderId = 'po-1';
            const updateDto: UpdatePurchaseOrderDto = {
                notes: 'Updated notes',
                deliveryDate: new Date('2024-02-15')
            };

            const updatedOrder = { ...mockPurchaseOrder, notes: 'Updated notes' };

            service.updateOrder(orderId, updateDto).subscribe(order => {
                expect(order.notes).toBe('Updated notes');
                done();
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(updateDto);
            req.flush(updatedOrder);
        });
    });

    describe('deleteOrder', () => {
        it('should delete a purchase order', (done) => {
            const orderId = 'po-1';

            service.deleteOrder(orderId).subscribe(() => {
                done();
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });

        it('should handle conflict when order has linked transactions', (done) => {
            const orderId = 'po-1';

            service.deleteOrder(orderId).subscribe({
                error: (error) => {
                    expect(error.message).toBeDefined();
                    done();
                }
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
            req.flush(
                { message: 'Cannot delete order with linked transactions' },
                { status: 409, statusText: 'Conflict' }
            );
        });
    });

    describe('updateStatus', () => {
        it('should update purchase order status', (done) => {
            const orderId = 'po-1';
            const newStatus = POStatus.PARTIALLY_RECEIVED;
            const updatedOrder = { ...mockPurchaseOrder, status: newStatus };

            service.updateStatus(orderId, newStatus).subscribe(order => {
                expect(order.status).toBe(newStatus);
                done();
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}/status`);
            expect(req.request.method).toBe('PATCH');
            expect(req.request.body).toEqual({ status: newStatus });
            req.flush(updatedOrder);
        });
    });

    describe('searchForLookup', () => {
        it('should search purchase orders for lookup', (done) => {
            const criteria: POLookupCriteria = {
                poNumber: 'PO-2024',
                supplierId: 'sup-1'
            };

            service.searchForLookup(criteria).subscribe(orders => {
                expect(orders).toEqual([mockPurchaseOrder]);
                done();
            });

            const req = httpMock.expectOne(request => {
                return request.url === `${apiUrl}/lookup` &&
                    request.params.has('poNumber') &&
                    request.params.has('supplierId');
            });
            expect(req.request.method).toBe('GET');
            req.flush([mockPurchaseOrder]);
        });

        it('should handle date range filters', (done) => {
            const criteria: POLookupCriteria = {
                dateFrom: new Date('2024-01-01'),
                dateTo: new Date('2024-01-31')
            };

            service.searchForLookup(criteria).subscribe(() => done());

            const req = httpMock.expectOne(request => {
                return request.url === `${apiUrl}/lookup` &&
                    request.params.has('dateFrom') &&
                    request.params.has('dateTo');
            });
            req.flush([mockPurchaseOrder]);
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors', (done) => {
            service.getOrders().subscribe({
                error: (error) => {
                    expect(error.message).toContain('Network error');
                    done();
                }
            });

            const req = httpMock.expectOne(apiUrl);
            req.error(new ProgressEvent('Network error'));
        });

        it('should handle 401 unauthorized errors', (done) => {
            service.getOrders().subscribe({
                error: (error) => {
                    expect(error.message).toContain('Unauthorized');
                    done();
                }
            });

            const req = httpMock.expectOne(apiUrl);
            req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
        });

        it('should handle 403 forbidden errors', (done) => {
            service.createOrder({} as CreatePurchaseOrderDto).subscribe({
                error: (error) => {
                    expect(error.message).toContain('permission');
                    done();
                }
            });

            const req = httpMock.expectOne(apiUrl);
            req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
        });

        it('should handle 500 server errors', (done) => {
            service.getOrders().subscribe({
                error: (error) => {
                    expect(error.message).toContain('Server error');
                    done();
                }
            });

            const req = httpMock.expectOne(apiUrl);
            req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });
        });

        it('should handle record locked conflict', (done) => {
            const orderId = 'po-1';

            service.updateOrder(orderId, {}).subscribe({
                error: (error) => {
                    expect(error.message).toContain('being edited');
                    done();
                }
            });

            const req = httpMock.expectOne(`${apiUrl}/${orderId}`);
            req.flush(
                {
                    code: 'RECORD_LOCKED',
                    lockedBy: 'John Doe',
                    message: 'Record is locked'
                },
                { status: 409, statusText: 'Conflict' }
            );
        });
    });
});
