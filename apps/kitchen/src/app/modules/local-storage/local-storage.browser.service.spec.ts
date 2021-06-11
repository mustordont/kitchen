import {LocalStorageBrowserService} from './local-storage.browser.service';

describe('LocalStorageBrowserService', () => {
    const testKey: string = `LocalStorageServiceTestKey_` + new Date().valueOf();
    const testObj = {label: 'valueLabel', id: 123};
    const service: LocalStorageBrowserService = new LocalStorageBrowserService();

    beforeEach(() => {
        service.removeItem(testKey);
    });

    afterEach(() => {
        service.removeItem(testKey);
    });

    it('should set new object and correcty get it', () => {
        service.setItem(testKey, testObj);
        expect(service.getItem(testKey)).toEqual(testObj);
    });

    it('should remove object by key', () => {
        service.setItem(testKey, testObj);
        service.removeItem(testKey);
        expect(service.getItem(testKey)).toBeNull();
    });
});
