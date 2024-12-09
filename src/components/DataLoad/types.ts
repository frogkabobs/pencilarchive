/*export type Catalogs = {
    [type: string]: {
        [company: string]: {
            [year: string]: {
                [page: string]: string;
            };
        };
    };
};*/

export interface Selection {
    type: string;
    company: string;
    year: string;
    page: string;
}
