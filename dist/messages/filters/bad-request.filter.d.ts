import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
export declare class BadRequestFilter extends BaseWsExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost): void;
}
