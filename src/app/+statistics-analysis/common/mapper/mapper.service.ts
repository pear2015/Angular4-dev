import { Injectable } from '@angular/core';
import { UtilHelper } from '../../../core';

@Injectable()
export class MapperManagerService {

    constructor(private utilHelper: UtilHelper) {

    }

    /**
     * 映射对象
     */
    mapper<EntityType, ModelType>(entity: EntityType, model: ModelType): ModelType {
        if (this.utilHelper.AssertEqualNull(entity)) {
            return null;
        }
        Reflect.ownKeys(<Object>entity).forEach(property => {
            if (model.hasOwnProperty(property.toString())) {
                Reflect.set(<Object>model, property, Reflect.get(<Object>entity, property));
            }
        });
        return model;
    }
    // tslint:disable-next-line:eofline
}

/**
 * 映射接口
 */
export interface MapperService {

    mapper<EntityType, ModelType>(entity: EntityType): ModelType;

    // tslint:disable-next-line:eofline
}