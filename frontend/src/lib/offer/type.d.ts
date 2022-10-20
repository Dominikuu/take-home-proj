interface Offer {
    id: string;
    jobTitle: string;
    body?: string;
    comments: ReplyComment[];
    salary: number;
    bonus: number;
    culture: string;
    learning: string;
    content: string;
    author: any;
    create_time: number;
}

type ReplyComment = {
    content: string;
    author: any;
    create_time: number;
    access: string;
    id: string;
};

type OfferState = {
    offer: Offer[];
};

type OfferAction = {
    type: ActionType;
    offer?: Offer[];
};

type OfferDispatchType = (args: OfferAction) => OfferAction;
