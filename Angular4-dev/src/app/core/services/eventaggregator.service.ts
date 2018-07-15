import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 * 时间聚合服务
 */
@Injectable()
export class EventAggregator {

    private eventObjects: EventObject[] = [];

    /**
     * @param {string} event - 事件名称
     * @param {string} key -关键字
     * @param {function} func - 订阅需要执行的委托
     * 订阅事件
     * 订阅事件，第一次push 到eventObjects 集合
     * 订阅事件，第二次key 值 不一样 push 到到eventObjects
     */
    subscribe(event: string, key: string, func: (param: any) => void) {
        let eos = this.eventObjects.filter((eo) => {
            if (eo.event === event) {
                return eo;
            }
        });
        if (eos === undefined || eos == null || eos.length === 0) {
            let subject = new Subject();
            subject.subscribe(
                {
                    next: (v) => {
                        func(v);
                    }
                }
            );
            let eventObject = new EventObject();
            eventObject.event = event;
            eventObject.key = key;
            eventObject.subject = subject;
            this.eventObjects.push(eventObject);
        } else {
            let subject = eos[0].subject;
            subject.subscribe(
                {
                    next: (v) => {
                        func(v);
                    }
                }
            );
        }
    }

    /**
     * @param {event} event - 事件名称
     * @param {any} param - 参数
     */
    publish(event: string, param: any) {
        let eos = this.eventObjects.filter((eo) => {
            if (eo.event === event) {
                return eo;
            }
        });
        if (eos.length !== 0) {
            let subject = eos[0].subject;
            subject.next(param);
        }
    };
}

/**
 * 事件对象
 */
class EventObject {
    /**
     * 事件名称
     */
    event: string;
    /**
     * 关键字
     */
    key: string;
    /**
     * 观察者对象
     */
    subject: Subject<any>;
}
