export interface Column {
    id: string;
    visible?: boolean
    label: string,
    hideOrder: number,
    width?: number,
    role?: [
        { 
            view?:boolean,
            option?:{
                label:string,
                url:string
            }
        },
        { 
            edit?:boolean,
            option?:{
                label:string,
                url:string
            }
        },
        { 
            delete?:boolean,
            option?:{
                label:string,
                url:string
            }
        }
    ]
}