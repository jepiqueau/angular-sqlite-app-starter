import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UrlSerializer } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductDefaultQueryRepository } from 'src/app/repositories/product.default.query.repository';
import { ProductRepository } from 'src/app/repositories/product.repository';
import productsData from 'src/app/repositories/products-data-example';
import { DatabaseService } from 'src/app/services/database.service';
import { DetailService } from 'src/app/services/detail.service';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { ProductsPage } from './products.page';


describe('TestProductsPage', () => {
  let component: ProductsPage;
  let fixture: ComponentFixture<ProductsPage>;

  beforeEach(waitForAsync(() => {

    let fakeProductRepository: ProductRepository = spyOnAllFunctions<ProductRepository>(ProductRepository.prototype);
    fakeProductRepository.getProducts = async () => {
      return Promise.resolve(productsData);
    }
    fakeProductRepository.createProduct = async () => {
      return null;
    }
    fakeProductRepository.updateProduct = async () => {
      return Promise.resolve(null);
    }
    fakeProductRepository.deleteProductById = async () => {
      return Promise.resolve(null);
    }
    fakeProductRepository.createTestData = async () => {
      return Promise.resolve(null);
    }

    const testbed = {
      declarations: [ProductsPage],
      providers: [
        { provide: SQLiteService, useClass: SQLiteService },
        { provide: DetailService, useClass: DetailService },
        { provide: UrlSerializer, useClass: UrlSerializer },
        { provide: DatabaseService, useClass: DatabaseService },
        { provide: ProductRepository, useValue: fakeProductRepository },
        { provide: ProductDefaultQueryRepository, useClass: ProductDefaultQueryRepository },
      ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }

    TestBed.configureTestingModule(testbed).compileComponents();
    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    fixture.isStable();
    fixture.detectChanges();
  }));

  it('should create the component', async () => {
    expect(component).toBeTruthy();
    expect(component.products).toEqual(productsData);
  });
  it('should create an array of products', async () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.debugElement.nativeElement;
    var productTitlesElements: NodeListOf<Element> = element.querySelectorAll('#container ion-card ion-card-title');
    var productTitles = [...productTitlesElements].map(x => x.innerHTML);
    var expectedProductTitles = productsData.map(x => x.name);
    expect(component).toBeTruthy();
    expect(productTitles).toEqual(expectedProductTitles);

  });
});