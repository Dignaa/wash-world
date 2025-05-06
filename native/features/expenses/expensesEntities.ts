export class ExpenseEntity {
    id: number;
    categoryID: string;
    price: number;
    date: Date;
    img?: any;
    byUserID: number;

    constructor(
        id: number,
        categoryID: string,
        price: number,
        date: Date,
        img: any,
        byUserID: number
    ) {
        this.id = id;
        this.categoryID = categoryID;
        this.price = price;
        this.date = date;
        this.img = img;
        this.byUserID = byUserID;
    }
}

export class NewExpenseEntity {
    categoryID: string;
    price: number;
    date: Date;
    img?: any;

    constructor(categoryID: string, price: number, date: Date, img?: any) {
        this.categoryID = categoryID;
        this.price = price;
        this.date = date;
        this.img = img;
    }
}
