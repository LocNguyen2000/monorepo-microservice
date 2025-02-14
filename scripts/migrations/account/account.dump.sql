insert into roles (id, role) values (1, 'User'), (2, 'Super Administrator'), (3, 'Administrator'), (4, 'Tenant'), (5, 'Rent Owner')

insert into clients (name, clientId, clientSecret, redirectUris, accessTimeout, refreshTimeout)
VALUES ( 'Rental client','f490df8b-4391-4f2d-b28c-480b965782e0','Ub5BocmUH5eyd3sCFZ2BQTrVU', 'http://localhost:5173',3600, 86400), ('Admin client','4cf66bee-7070-443a-85cc-4d255de0d382','BNrMEm6njOQnd0lm3kuooxkc6', 'http://localhost:3000',3600, 86400);

