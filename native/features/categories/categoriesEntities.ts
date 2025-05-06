export class CategoryEntity {
    id: number;
    title: string;
    byUserID: number;

    constructor(id: number, title: string, byuserID: number) {
        this.id = id;
        this.title = title;
        this.byUserID = byuserID;
    }
}

export class NewCategoryEntity {
    title: string;

    constructor(title: string) {
        this.title = title;
    }
}
