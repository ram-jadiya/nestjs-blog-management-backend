import { SetMetadata } from '@nestjs/common';

/**
 * The metadata key for checking if the route is public.
 * @constant {string}
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * A custom decorator to mark a route as public.
 *
 * This decorator adds metadata to a route handler indicating that the route is public.
 * Routes marked with this decorator can be accessed without authentication or authorization.
 *
 * @returns {MethodDecorator} The method decorator to be applied to a route handler.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
