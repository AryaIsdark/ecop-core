export interface DatabaseConfig {
    type: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mongodb' | 'mssql';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: any[];
    synchronize: boolean;
    migrations: any;
  }