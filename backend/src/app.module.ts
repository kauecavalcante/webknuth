import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Faz com que todas as partes do app tenham acesso a process.env
    }),
    SupabaseModule,
  ],
})
export class AppModule {}
