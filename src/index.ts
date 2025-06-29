import { IProduct } from './types/index';
import { AppApi } from './components/base/common/AppApi';
import { ProductData } from './components/base/common/ProductData';
import { EventEmitter } from './components/base/base/events';
import { Product } from './components/base/common/ProductItem';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/base/base/Modal';
import { Page } from './components/base/common/Page';
import { BasketItem } from './components/base/common/BasketItem';
import { Basket } from './components/base/Basket';
import { ProdcutPreview } from './components/base/common/ProductPreview';
import { AddressForm, IOrder } from './components/base/common/AddressForm';
import { ContactsForm } from './components/base/common/ContactsForm';
import { SuccessFrom } from './components/base/common/SuccessForm';

const templateProduct: HTMLTemplateElement = document.querySelector('#card-catalog');
const templatePreview: HTMLTemplateElement = document.querySelector('#card-preview');
const basketTempalte: HTMLTemplateElement = document.querySelector('#basket');
const basketItemTemplate: HTMLTemplateElement = document.querySelector('#card-basket')
const formTemplate: HTMLTemplateElement = document.querySelector('#order')
const successTemplate: HTMLTemplateElement = document.querySelector('#success')
const contactTemplate: HTMLTemplateElement = document.querySelector('#contacts');

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const productsData = new ProductData(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const productPreview = new ProdcutPreview(cloneTemplate(templatePreview), events);
const page = new Page(document.body, events);
const basket = new Basket(cloneTemplate(basketTempalte), events);
const addressForm = new AddressForm(cloneTemplate(formTemplate), events)
const success = new SuccessFrom(cloneTemplate(successTemplate), events)
const contact = new ContactsForm(cloneTemplate(contactTemplate), events)

api.getProductist().then((appData) => {
    productsData.products = appData;
    const productArray = productsData.products.map((product) => {
        const productInstant = new Product(cloneTemplate(templateProduct), events);
        return productInstant.render(product)
    })

    page.render({ catalog: productArray })

})

events.on('product:select', (data: { current: IProduct }) => {
    let currentItem = productsData.getProduct(data.current.id)
    modal.render({
        content:productPreview.render(productsData.getProduct(data.current.id))
         
            // title: currentItem.title,
            // image: currentItem.image,
            // price: currentItem.price,
            // cagetory: currentItem.category,
            // id: currentItem.id,
            // description: currentItem.description,
    })
    productPreview.checkDisabled(productsData.selected(currentItem.id))

})
// })


events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('product add basket', (data: { current: IProduct }) => {
    productsData.addItemBasket(productsData.getProduct(data.current.id))
    page.render({ counter: productsData.basket })
        productPreview.checkDisabled(productsData.selected(data.current.id))
    modal.close()
})

events.on('basket:open', () => {
    const BasketArray = productsData.basket.map((item) => {
        const testItem = new BasketItem(cloneTemplate(basketItemTemplate), events);
        return testItem.render({
            index: productsData.indexBasket(item.id),
            title: item.title,
            price: item.price,
            id: item.id
        })

    })

    modal.render({
        content: basket.render({
            catalog: BasketArray,
            totalAmount: productsData.totalAmount
        })
    })
})

events.on('delete:product', (data: { item: IProduct }) => {
    productsData.deleteItemBasket(data.item.id);
    page.render({
        counter: productsData.basket
    });
    const BasketArray = productsData.basket.map((item) => {
        const testItem = new BasketItem(cloneTemplate(basketItemTemplate), events);
        return testItem.render({
            index: productsData.indexBasket(item.id),
            title: item.title,
            price: item.price,
            id: item.id
        })
    })
    modal.render({
        content: basket.render({
            catalog: BasketArray,
            totalAmount: productsData.totalAmount
        })
    })
})



events.on('address:open', () => {
    modal.render({
        content: addressForm.render({
            inputValues: { address: productsData.order.address }
        })
    })
    addressForm.checkButton(productsData.validateOrderAddress())
    productsData.setPriceOrder()
    productsData.setItemOrder(productsData.basket)
    addressForm.choicePayment(productsData.order.payment)
})



events.on('сontact:open', () => {
    modal.render({
        content: contact.render({
            inputValues: {
                email: productsData.order.email,
                phone: productsData.order.phone
            }
        })
    })
    contact.checkButton(productsData.validOrderContacts())
})

events.on(/^order\..*:change/, (data: { field: keyof IOrder, value: string }) => {
    productsData.setOrderField(data.field, data.value);
    addressForm.checkButton(productsData.validateOrderAddress())
});


events.on(/^contacts\..*:change/, (data: { field: keyof IOrder, value: string }) => {
    productsData.setOrderField(data.field, data.value);
    contact.checkButton(productsData.validOrderContacts())
});


events.on('order', () => {
    console.log(productsData.order)
    api.order(productsData.order).then(result => {
        console.log(result)
        modal.render({
            content: success.render({
                description: productsData.order.total
            })
        })
        contact.render({
            inputValues: {
                email: '',
                phone: ''
            }
        })
        addressForm.render({
            inputValues: { address: '' }
        })
        productsData.orderReset()
        page.render({ counter: productsData.basket })
    }).catch((error) => {
        alert(error)
    })

})


events.on(/^payment\..*:change/, (data: { field: string }) => {
    productsData.payment(data.field)
    addressForm.checkButton(productsData.validateOrderAddress())
    addressForm.choicePayment(productsData.order.payment)
})

events.on('close:Success', () => {
    modal.close()
})