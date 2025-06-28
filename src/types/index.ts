export interface IProduct { 
     description: string;
     image: string;
     title: string;
     category: string;
     price: number;
     id: string;
}

export const categoryMap = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other',
};

export type CategoryKey = keyof typeof categoryMap;
