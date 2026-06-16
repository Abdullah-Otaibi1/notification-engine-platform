import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Mock ESB Service Layer.
 * All methods here simulate responses from the Enterprise Service Bus.
 * When real ESB endpoints are available, replace method bodies with HTTP calls.
 */
@Injectable()
export class EsbService {
  private readonly logger = new Logger(EsbService.name);

  constructor(private configService: ConfigService) {}

  async getChannelHealth(): Promise<any[]> {
    this.logger.debug('ESB: getChannelHealth (mock)');
    return [];
  }

  async getProviders(): Promise<any[]> {
    this.logger.debug('ESB: getProviders (mock)');
    return [];
  }

  async enableProvider(providerId: string): Promise<void> {
    this.logger.debug(`ESB: enableProvider ${providerId} (mock)`);
  }

  async disableProvider(providerId: string): Promise<void> {
    this.logger.debug(`ESB: disableProvider ${providerId} (mock)`);
  }

  async retryNotification(notificationId: string): Promise<void> {
    this.logger.debug(`ESB: retryNotification ${notificationId} (mock)`);
  }
}
