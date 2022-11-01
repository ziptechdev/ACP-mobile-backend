interface BaseMailBody {
  from: string;
  to: string;
  subject: string;
}

interface MailPlainTextBody extends BaseMailBody {
  text: string;
}

interface MailHtmlBody extends BaseMailBody {
  html: string;
}

interface MailAuth {
  user: string;
  pass: string;
}

export type MailBody = MailPlainTextBody | MailHtmlBody;
