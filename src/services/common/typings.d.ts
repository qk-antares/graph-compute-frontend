declare namespace Common {
  type PageParams = {
    current?: number;
    pageSize?: number;
  }

  type R = {
    code?: number;
    msg?: string;
    data?: any;
  }
}
