import { UserSettingCategory } from "../entities";

export class CreateUserSettingDto {
    category: UserSettingCategory
    key: string
    value: string
    userId: number
}
