import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fgcxhsqflbgpmjqoipol.supabase.co'
const SUPABASE_KEY = 'sb_publishable_OiS-RS4qaOtmkuWop1f5AA_Nk8mOGXP'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)