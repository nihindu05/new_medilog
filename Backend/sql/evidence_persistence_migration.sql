ALTER TABLE sample_evidence
    ADD COLUMN IF NOT EXISTS sample_reference varchar(50),
    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS uq_sample_evidence_reference
    ON sample_evidence(sample_reference)
    WHERE sample_reference IS NOT NULL;
