/** Google Ads account of the campaign: «AW-» and digits (it goes into a script URL). Empty = Google Ads off, nothing loaded or sent. */
export function parseAdsId(raw: string | undefined): string {
  const id = raw?.trim() ?? "";
  return /^AW-\d+$/.test(id) ? id : "";
}

/** Label of the «iscrizione» conversion, from the Ads account. Empty = no conversion is sent. */
export function parseConversionLabel(raw: string | undefined): string {
  const label = raw?.trim() ?? "";
  return /^[\w-]+$/.test(label) ? label : "";
}

export const GOOGLE_ADS_ID = parseAdsId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
export const GOOGLE_ADS_CONVERSION_LABEL = parseConversionLabel(process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL);

type Choice = { analytics: boolean; marketing: boolean } | null;

/**
 * Whether the Google Ads tag runs: with an ID, the cookie banner's marketing consent (the one Meta uses), and not on
 * invite pages, whose address carries the inviter's code and a token.
 */
export function adsOn(id: string, choice: Choice, invite: boolean): boolean {
  return id !== "" && choice?.marketing === true && !invite;
}

/** `send_to` of the conversion event; empty when the ID or the label is missing, and then nothing is sent. */
export function conversionTarget(id: string, label: string): string {
  return id && label ? `${id}/${label}` : "";
}

/**
 * Google consent mode from the banner. Advertising storage and user data are granted only when Google Ads is on, so
 * with no ID nothing changes for Google Analytics. Personalised ads stay denied: the tag measures sign-ups, no more.
 */
export function consentState(analytics: boolean, ads: boolean) {
  const grant = (on: boolean) => (on ? "granted" : "denied");
  return {
    ad_storage: grant(ads),
    ad_user_data: grant(ads),
    ad_personalization: "denied",
    analytics_storage: grant(analytics),
  };
}
