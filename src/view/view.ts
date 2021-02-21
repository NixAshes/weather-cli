export interface View {
    forAPI: string,
    view: {
        title?: string,
        header?: string,
        sections: Array<{
            sectionTitle?: string,
            sectionHeader?: string,
            records: Array<{
                label?: string,
                head?: string,
                dataLocation: string,
                tail?: string
            }>,
            sectionFooter?: string
        }>,
        footer?: string
        sectionDelineator?: string
    }
}

