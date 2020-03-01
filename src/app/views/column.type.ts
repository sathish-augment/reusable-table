export interface Column {
    id: string;
    visible?: boolean
    label: string,
    hideOrder: number,
    width?: number,
    roles?: { 
        type:string // button, link, toggle
        label:string,
        for:string
    }[]
}