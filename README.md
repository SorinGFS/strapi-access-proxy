# Strapi Access Proxy

Strapi access management based on JWT.

### Motivation

Strapi does not offer access management nor does it have to offer because the needs can be very different from case to case. Moreover, we can have multiple Strapi applications installed which would mean that each application manages its access separately. That is why there was a need to be able to control access centrally.

### Installation

Strapi Access Proxy from `v2.0.0` on relies on much broader project [Access Proxy](https://github.com/SorinGFS/access-proxy). All the installation details can be found there.

### How it works

By default on login Strapi responds with a json web token in the response body. Access Proxy is filtering the token and save it in the database, and replaces that token with own token based on the payload of the Strapi token. From this point on Access Proxy takes the access management responsability. The Strapi token is valid one month. Access Proxy can manage the token validation separately for each host. For example, if the host is configured to expire the token in 30 minutes `(default)` if in this interval the user use the token validity is extended to the next 30 minutes (this is sliding expiration used by default). If the token expires user has to re-login into Strapi app. If is desired to let token to be valid the entire browser session the frontend framework must use the token to access Access Proxy within it's validity interval.

![login sequence](docs/images/login-sequence.png)

### Some usage ideas

#### Basic usage (my current case)

-   use Strapi as authentication provider and as a keeper for secure user data
-   add a new `TEXT` field in Strapi User Content Type named `audience` to hold the domain names that user has access to
-   use Access Proxy to manage the access to that Strapi db

#### Separate the admin channel from the regular user channel

-   You may block admin routes in downstream server and stil have centralized access on localhost or local network through this proxy.

#### Multiple Strapi apps, and another Strapi app for central user management

-   configure the first basic scenario
-   configure your other Strai apps with public data only. This way those apps can perform faster, can be placed on other server, can use load balancer, and so on. Take advantage from the fact that less than 10% of requests goes to secure user data.

#### External api connections

-   Use this proxy to perform external api requests in the backend instead of frontend, it increases the security.

### License

[MIT](LICENSE)
