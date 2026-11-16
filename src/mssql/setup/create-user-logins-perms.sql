-- =============================================================================
-- IVIA 11.0.3 MSSQL Setup: Create Domain Accounts and Grant Permissions
-- Domain: cp.xx (NetBIOS: CP)
-- Accounts:
--   - CP\configdbuser -> Permissions on IVIA_CONFIG
--   - CP\hvdbuser     -> Permissions on IVIA_HVDB
-- Run this as: sa (sysadmin) or a Windows Administrator with sysadmin rights
-- =============================================================================

USE master;
GO

-- =============================================================================
-- Step 1: Create Server-Level Logins for Both Domain Accounts
-- =============================================================================

-- 1.1 Login for configdbuser
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name IN (N'CP\configdbuser', N'cp.ab.test.com\configdbuser'))
BEGIN
    BEGIN TRY
        CREATE LOGIN [CP\configdbuser] FROM WINDOWS;
        PRINT 'Server login [CP\configdbuser] created successfully.';
    END TRY
    BEGIN CATCH
        BEGIN TRY
            CREATE LOGIN [cp.ab.test.com\configdbuser] FROM WINDOWS;
            PRINT 'Server login [cp.ab.test.com\configdbuser] created successfully.';
        END TRY
        BEGIN CATCH
            PRINT 'Failed to create login for configdbuser: ' + ERROR_MESSAGE();
        END CATCH
    END CATCH
END
ELSE
    PRINT 'Server login for configdbuser already exists - skipped.';
GO

-- 1.2 Login for hvdbuser
IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name IN (N'CP\hvdbuser', N'cp.ab.test.com\hvdbuser'))
BEGIN
    BEGIN TRY
        CREATE LOGIN [CP\hvdbuser] FROM WINDOWS;
        PRINT 'Server login [CP\hvdbuser] created successfully.';
    END TRY
    BEGIN CATCH
        BEGIN TRY
            CREATE LOGIN [cp.ab.test.com\hvdbuser] FROM WINDOWS;
            PRINT 'Server login [cp.ab.test.com\hvdbuser] created successfully.';
        END TRY
        BEGIN CATCH
            PRINT 'Failed to create login for hvdbuser: ' + ERROR_MESSAGE();
        END CATCH
    END CATCH
END
ELSE
    PRINT 'Server login for hvdbuser already exists - skipped.';
GO


-- =============================================================================
-- Step 2: Configure configdbuser Permissions in IVIA_CONFIG Database
-- =============================================================================
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'IVIA_CONFIG')
BEGIN
    USE IVIA_CONFIG;

    DECLARE @ConfigLogin NVARCHAR(128);
    SELECT TOP 1 @ConfigLogin = name 
    FROM sys.server_principals 
    WHERE name IN (N'CP\configdbuser', N'cp.ab.test.com\configdbuser');

    IF @ConfigLogin IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = @ConfigLogin)
        BEGIN
            DECLARE @SqlCreateConfigUser NVARCHAR(MAX) = N'CREATE USER [' + @ConfigLogin + N'] FOR LOGIN [' + @ConfigLogin + N'];';
            EXEC sp_executesql @SqlCreateConfigUser;
            PRINT 'Database user ' + @ConfigLogin + ' created in IVIA_CONFIG.';
        END
        ELSE
            PRINT 'Database user ' + @ConfigLogin + ' already exists in IVIA_CONFIG.';

        -- Grant database roles and permissions
        DECLARE @SqlConfigRoles NVARCHAR(MAX) = N'
            ALTER ROLE db_datareader ADD MEMBER [' + @ConfigLogin + N'];
            ALTER ROLE db_datawriter ADD MEMBER [' + @ConfigLogin + N'];
            ALTER ROLE db_ddladmin   ADD MEMBER [' + @ConfigLogin + N'];
            GRANT EXECUTE TO [' + @ConfigLogin + N'];';
        EXEC sp_executesql @SqlConfigRoles;

        PRINT 'Permissions granted to ' + @ConfigLogin + ' on IVIA_CONFIG.';
    END
    ELSE
        PRINT 'Login for configdbuser not found in sys.server_principals.';
END
ELSE
    PRINT 'Database IVIA_CONFIG not found - skipped.';
GO


-- =============================================================================
-- Step 3: Configure hvdbuser Permissions in IVIA_HVDB (Runtime) Database
-- =============================================================================
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'IVIA_HVDB')
BEGIN
    USE IVIA_HVDB;

    DECLARE @HvdbLogin NVARCHAR(128);
    SELECT TOP 1 @HvdbLogin = name 
    FROM sys.server_principals 
    WHERE name IN (N'CP\hvdbuser', N'cp.ab.test.com\hvdbuser');

    IF @HvdbLogin IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = @HvdbLogin)
        BEGIN
            DECLARE @SqlCreateHvdbUser NVARCHAR(MAX) = N'CREATE USER [' + @HvdbLogin + N'] FOR LOGIN [' + @HvdbLogin + N'];';
            EXEC sp_executesql @SqlCreateHvdbUser;
            PRINT 'Database user ' + @HvdbLogin + ' created in IVIA_HVDB.';
        END
        ELSE
            PRINT 'Database user ' + @HvdbLogin + ' already exists in IVIA_HVDB.';

        -- Grant database roles and permissions
        DECLARE @SqlHvdbRoles NVARCHAR(MAX) = N'
            ALTER ROLE db_datareader ADD MEMBER [' + @HvdbLogin + N'];
            ALTER ROLE db_datawriter ADD MEMBER [' + @HvdbLogin + N'];
            ALTER ROLE db_ddladmin   ADD MEMBER [' + @HvdbLogin + N'];
            GRANT EXECUTE TO [' + @HvdbLogin + N'];';
        EXEC sp_executesql @SqlHvdbRoles;

        PRINT 'Permissions granted to ' + @HvdbLogin + ' on IVIA_HVDB.';
    END
    ELSE
        PRINT 'Login for hvdbuser not found in sys.server_principals.';
END
ELSE
    PRINT 'Database IVIA_HVDB not found - skipped.';
GO


-- =============================================================================
-- Step 4: Verification Queries
-- =============================================================================
PRINT '------------------------------------------------------------';
PRINT 'Verifying Server Logins:';
SELECT name, type_desc, is_disabled 
FROM sys.server_principals 
WHERE name LIKE N'%configdbuser%' OR name LIKE N'%hvdbuser%';

PRINT '------------------------------------------------------------';
PRINT 'Verifying IVIA_CONFIG Roles (for configdbuser):';
USE IVIA_CONFIG;
SELECT dp.name AS UserName, r.name AS RoleName
FROM sys.database_role_members rm
JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
JOIN sys.database_principals dp ON rm.member_principal_id = dp.principal_id
WHERE dp.name LIKE N'%configdbuser%';

PRINT '------------------------------------------------------------';
PRINT 'Verifying IVIA_HVDB Roles (for hvdbuser):';
USE IVIA_HVDB;
SELECT dp.name AS UserName, r.name AS RoleName
FROM sys.database_role_members rm
JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
JOIN sys.database_principals dp ON rm.member_principal_id = dp.principal_id
WHERE dp.name LIKE N'%hvdbuser%';
GO
