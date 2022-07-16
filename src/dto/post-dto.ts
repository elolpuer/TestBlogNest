export interface PostDto {
    ID?: number;
    userID?: number;
    username?: string;
    text: string;
    date?: Date;
    filenames?: any[];
}