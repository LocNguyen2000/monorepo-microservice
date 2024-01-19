-- Active: 1703494540009@@127.0.0.1@3307@services
DROP PROCEDURE prcd_FindLocationExpenseById;

CREATE DEFINER =`root`@`%` PROCEDURE `prcd_FindLocationExpenseById`
(LocationId int) 
BEGIN 
	SELECT
	    l.`locationCode`,
	    l.`name`,
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
	    e.name,
	    e.price,
	    e.`inUsed`,
	    e.`type`
	FROM
	    locations l
	    LEFT JOIN expenses_location el ON l.`locationCode` = el.`locationCode`
	    LEFT JOIN expenses e ON e.`expenseCode` = el.`expenseCode`
	WHERE
	    l.`locationCode` = LocationId
	ORDER BY l.`createdAt`
	    and l.`updatedAt`;
END
