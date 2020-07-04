import { NotificationOptions } from "./notification-options";

export abstract class AbstractObserver {

    public abstract update(options: NotificationOptions): void;

}
