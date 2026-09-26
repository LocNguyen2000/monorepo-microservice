-- Active: 1733974675535@@127.0.0.1@3307@services
DROP PROCEDURE IF EXISTS `prcd_FindLocationExpenseById`;
CREATE PROCEDURE `prcd_FindLocationExpenseById`(IN LocationId INT, IN AccountId INT)
SQL SECURITY INVOKER
BEGIN 
	SELECT
	    l.`locationCode`,
	    l.`accountId`,
	    l.`locationName`,
	    l.`locationAddress`,
	    l.image,
	    l.`description`,
	    l.owner,
	    l.`roomSize`,
	    l.`createdAt`,
	    l.`createdBy`,
	    l.`updatedAt`,
	    l.`updatedBy`,
	    e.`expenseCode`,
	    e.`expenseName`,
        el.`initialUnit` as 'initialUnit',
        el.`currentUnit` as 'currentUnit',
        e.`unitName` as 'unitName',
	    e.price,
	    e.`inUsed`,
	    e.`type`
	FROM
	    locations l
	    LEFT JOIN expenses_location el ON l.`locationCode` = el.`locationCode`
	    LEFT JOIN expenses e ON e.`expenseCode` = el.`expenseCode` AND e.`accountId` = AccountId
	WHERE
	    l.`locationCode` = LocationId AND l.`accountId` = AccountId
	ORDER BY e.`expenseName`;
END