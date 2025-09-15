import { Injectable, Logger } from '@nestjs/common';

type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
};

@Injectable()
export class DiscordWebhookService {
  private readonly logger = new Logger(DiscordWebhookService.name);

  private get webhookUrl() {
    return process.env.DISCORD_WEBHOOK_URL;
  }

  async send(embeds?: DiscordEmbed[]) {
    if (!this.webhookUrl) {
      this.logger.warn('DISCORD_WEBHOOK_URL is not set. Skip sending.');
      return;
    }
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '퇴근요정 🧚',
          embeds,
        }),
      });
    } catch (e) {
      this.logger.error('Failed to send Discord webhook', e as any);
    }
  }

  async sendClockIn(userName: string, occurredAt: Date) {
    return this.send([
      {
        title: `🕘 ${userName}님이 출근 했습니다.`,
        color: 0x4e8aff,

        timestamp: occurredAt.toISOString(),
      },
    ]);
  }

  async sendClockOut(userName: string, occurredAt: Date) {
    return this.send([
      {
        title: `🕕 ${userName}님이 퇴근 했습니다.`,
        color: 0xff5340,
        timestamp: occurredAt.toISOString(),
      },
    ]);
  }
}
