import { AbstractObserver } from "./abstract-observer";

export abstract class AbstractSubject {
    public abstract addObserver(observer: AbstractObserver);
    public abstract notifyAllObservers(emailOptions: NotificationOptions): void;
}
