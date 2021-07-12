// https://github.com/bevacqua/local-storage
import * as ls from 'local-storage';
import settings from '@/settings.json';

// backreason
const config_backreason_key = settings.title + '-' + 'config_backreason';
export const get_config_backreason_key = () => ls.get(config_backreason_key);
export const set_config_backreason_key = (data: string) => ls.set(config_backreason_key, data);
export const remove_config_backreason_key = () => ls.remove(config_backreason_key);
