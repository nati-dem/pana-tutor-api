import { Container } from "typescript-ioc";
import { WpIntegrationSupport } from "./wp-integration-support";

export abstract class IntegrationSupport {
    abstract generateServiceToken (): Promise<string>;
}

Container.bind(IntegrationSupport).to(WpIntegrationSupport);
