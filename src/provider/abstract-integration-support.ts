import { Container } from "typescript-ioc";
import { WpIntegrationSupport } from "./wp-integration-support";

export abstract class AbstractIntegrationSupport {
    abstract generateServiceToken (): Promise<string>;
}

Container.bind(AbstractIntegrationSupport).to(WpIntegrationSupport);
