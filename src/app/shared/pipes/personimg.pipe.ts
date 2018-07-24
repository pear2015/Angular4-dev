import { Pipe, PipeTransform } from '@angular/core';
import { OrgPersonService } from '../../core';
/**
 * 通过人员id 获取人员对应图片
 * @export
 * @class PersonImgPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'mfPerImgPipe' })
export class PersonImgPipe implements PipeTransform {
    /**
     *
     */
    constructor(private personService: OrgPersonService) {

    }

    // 传入personId 获取图片数据
    async transform(personId: string) {
        if (personId != null && personId !== undefined && personId !== '') {
            // 获取图片数据
            try {
                let result = await this.personService.readCacheImage(personId);
                if (result == null || result === undefined) {
                    let person = await this.personService.getPersonByPersonId(personId);
                    if (person != null && person !== undefined && person.gif != null && person.gif !== undefined) {
                        return 'data:image/jpg;base64,' + person.gif;
                    } else {
                        return './themes/images/person.png';
                    }
                } else {
                    return 'data:image/jpg;base64,' + result;
                }
            } catch (error) {
                let person = await this.personService.getPersonByPersonId(personId);
                if (person != null && person !== undefined && person.gif != null && person.gif !== undefined) {
                    return 'data:image/jpg;base64,' + person.gif;
                } else {
                    return './themes/images/person.png';
                }
            }

        }
        return './themes/images/admin.png';
    }
}
