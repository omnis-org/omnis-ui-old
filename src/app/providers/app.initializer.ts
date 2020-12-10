import { AccountService } from '@app/services';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function appInitializer(accountService: AccountService) {
    console.log('appInitializer');
    return () => new Promise(resolve => {
        // attempt to refresh token on app start up to auto authenticate
        accountService.refreshToken()
            .subscribe()
            .add(resolve);
    });
}
