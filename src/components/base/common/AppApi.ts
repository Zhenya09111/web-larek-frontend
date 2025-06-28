import { IProduct } from "../../../types";
import { Api, ApiListResponse } from "../base/api";
import { IOrder } from "./AddressForm";

export interface IOrderResult {
    id: string;
}

export class AppApi extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit){
        super(baseUrl, options);
        this.cdn = cdn;
    }

       getProductist(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }


     order(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}