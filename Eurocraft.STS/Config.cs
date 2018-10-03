using System.Collections.Generic;
using IdentityServer4;
using IdentityServer4.Models;

namespace Eurocraft.STS
{
    public class Config
    {
        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("eurocraft-api", "Eurocraft API")
            };
        }

        public static IEnumerable<Client> GetClients()
        {
            return new List<Client>
            {
                new Client
                {
                    ClientId = "eurocraft-client",
                    ClientName = "Eurocraft UI",
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RequireConsent = false,

                    RedirectUris =           { "http://localhost:4200/assets/oidc-login-redirect.html","http://localhost:4200/assets/silent-redirect.html",
                                               "http://localhost:8080/eurocraft/assets/oidc-login-redirect.html","http://localhost:8080/eurocraft/assets/silent-redirect.html",
                                               "http://swaypc.ddns.net:8956/eurocraft/assets/oidc-login-redirect.html","http://swaypc.ddns.net:8956/eurocraft/assets/silent-redirect.html" },
                    PostLogoutRedirectUris = { "http://localhost:4200/?postLogout=true",
                                               "http://localhost:8080/eurocraft/?postLogout=true",
                                               "http://swaypc.ddns.net:8956/eurocraft/?postLogout=true" },
                    AllowedCorsOrigins =     { "http://localhost:4200/",
                                               "http://localhost:8080/eurocraft/",
                                               "http://swaypc.ddns.net:8956/eurocraft/" },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "eurocraft-api"
                    },
                    IdentityTokenLifetime=200,
                    AccessTokenLifetime=200

                },
                new Client
                {
                    ClientId = "mvc",
                    ClientName = "MVC Client",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris           = { "https://localhost:4201/signin-oidc" },
                    PostLogoutRedirectUris = { "https://localhost:4201/signout-callback-oidc" },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    },
                    AllowOfflineAccess = true

                }
            };
        }

        public static IEnumerable<IdentityResource> GetIdentityResources()
            {
                return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
            };
            }
        }
    }