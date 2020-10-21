




BEGIN 

IF NEW.stock < 0 THEN
    
        IF 
        (   ((
                (
                    SELECT (CASE WHEN sum::int IS NULL THEN 0 ELSE sum END)  FROM (SELECT SUM(stock) FROM inventory) a
                )
                + NEW.stock
            ) <= 0)::boolean				

        ) 
        THEN 
            RAISE EXCEPTION 'Not enough stocks. Invalid stock entry';

        END IF;
    
END IF;

RETURN NEW;

END;



new functions 
CREATE or REPLACE FUNCTION test2(integer) RETURNS SETOF RECORD AS $$

DECLARE 
	mynum integer := $1;
	res record;
	r record;
	rr record;

BEGIN
	SELECT * INTO res FROM jobcards;
	IF NOT FOUND THEN 
		RAISE NOTICE 'Not found';
	END IF;
	
	for r in (select jsonb_array_elements(res.products_headings))
    loop
        raise notice 'yo %', to_jsonb(r)->'jsonb_array_elements';
		raise notice 'test %',to_jsonb(r)->'jsonb_array_elements'->'pItems';
		
		
		
		for rr in (select jsonb_array_elements FROM jsonb_array_elements( (to_jsonb(r)->'jsonb_array_elements'->'pItems')))
		loop
			raise notice ' inner -> % %',to_jsonb(rr),to_jsonb(rr)->'jsonb_array_elements'->'pid';
		end loop;
		

	
		
    end loop;
	
	RAISE NOTICE 'TEST is %', mynum;
	
END;

$$ LANGUAGE plpgsql;