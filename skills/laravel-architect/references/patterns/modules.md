# Modules Pattern

## Purpose

Modules are internal **mini-frameworks** for specific domains:
- Self-contained functionality
- Domain-specific orchestration
- Complex workflow management
- Example: `WorkflowEngine` module

## Directory Structure

```
app/Modules/
└── WorkflowEngine/
    ├── WorkflowEngineExecutor.php
    ├── WorkflowEngineContext.php
    ├── Steps/
    │   ├── AbstractStep.php
    │   ├── InputStep.php
    │   ├── LlmStep.php
    │   ├── ToolStep.php
    │   └── OutputStep.php
    ├── Handlers/
    │   ├── HandlerInterface.php
    │   ├── KnowledgeSearchHandler.php
    │   └── WebSearchHandler.php
    └── Exceptions/
        └── WorkflowException.php
```

## Example: WorkflowEngine Module

### Executor (Orchestrator)

```php
<?php

declare(strict_types=1);

namespace App\Modules\WorkflowEngine;

use App\Modules\WorkflowEngine\Steps\AbstractStep;
use Illuminate\Support\Facades\Log;

final class WorkflowEngineExecutor
{
    /**
     * @param array<AbstractStep> $steps
     */
    public function __construct(
        private readonly array $steps,
        private readonly WorkflowEngineContext $context
    ) {}

    public function execute(): mixed
    {
        foreach ($this->steps as $step) {
            Log::info('Executing step', ['step' => get_class($step)]);

            $result = $step->execute($this->context);

            // Update context with result
            $this->context->addResult($step->getName(), $result);

            // Check if should stop
            if ($step->shouldStop($result)) {
                break;
            }
        }

        return $this->context->getOutput();
    }
}
```

### Context (State Container)

```php
<?php

declare(strict_types=1);

namespace App\Modules\WorkflowEngine;

final class WorkflowEngineContext
{
    private array $results = [];
    private array $metadata = [];

    public function __construct(
        private readonly array $input
    ) {}

    public function getInput(): array
    {
        return $this->input;
    }

    public function addResult(string $stepName, mixed $result): void
    {
        $this->results[$stepName] = $result;
    }

    public function getResult(string $stepName): mixed
    {
        return $this->results[$stepName] ?? null;
    }

    public function setMetadata(string $key, mixed $value): void
    {
        $this->metadata[$key] = $value;
    }

    public function getOutput(): array
    {
        return [
            'results' => $this->results,
            'metadata' => $this->metadata,
        ];
    }
}
```

### Abstract Step

```php
<?php

declare(strict_types=1);

namespace App\Modules\WorkflowEngine\Steps;

use App\Modules\WorkflowEngine\WorkflowEngineContext;

abstract class AbstractStep
{
    abstract public function getName(): string;

    abstract public function execute(WorkflowEngineContext $context): mixed;

    public function shouldStop(mixed $result): bool
    {
        return false;
    }
}
```

### Concrete Step

```php
<?php

declare(strict_types=1);

namespace App\Modules\WorkflowEngine\Steps;

use App\Integrations\AiProvider\AiProviderClient;
use App\Modules\WorkflowEngine\WorkflowEngineContext;

final class LlmStep extends AbstractStep
{
    public function __construct(
        private readonly AiProviderClient $aiProvider,
        private readonly string $systemPrompt
    ) {}

    public function getName(): string
    {
        return 'llm_generation';
    }

    public function execute(WorkflowEngineContext $context): string
    {
        $userMessage = $context->getInput()['message'];

        $response = $this->aiProvider->createCompletion([
            ['role' => 'system', 'content' => $this->systemPrompt],
            ['role' => 'user', 'content' => $userMessage],
        ]);

        return $response['choices'][0]['message']['content'];
    }
}
```

### Handler Interface

```php
<?php

declare(strict_types=1);

namespace App\Modules\WorkflowEngine\Handlers;

interface HandlerInterface
{
    public function handle(array $params): mixed;

    public function getName(): string;
}
```

### Concrete Handler

```php
<?php

declare(strict_types=1);

namespace App\Modules\WorkflowEngine\Handlers;

use App\Services\KnowledgeService;

final class KnowledgeSearchHandler implements HandlerInterface
{
    public function __construct(
        private readonly KnowledgeService $knowledgeService
    ) {}

    public function getName(): string
    {
        return 'knowledge_search';
    }

    public function handle(array $params): array
    {
        $query = $params['query'] ?? '';

        return $this->knowledgeService->search($query);
    }
}
```

## Usage

```php
// In a Service or Controller
use App\Modules\WorkflowEngine\WorkflowEngineExecutor;
use App\Modules\WorkflowEngine\WorkflowEngineContext;
use App\Modules\WorkflowEngine\Steps\InputStep;
use App\Modules\WorkflowEngine\Steps\LlmStep;
use App\Modules\WorkflowEngine\Steps\OutputStep;

$context = new WorkflowEngineContext([
    'message' => 'Hello, can you help me with my account setup?',
]);

$executor = new WorkflowEngineExecutor(
    steps: [
        new InputStep(),
        new LlmStep($aiProviderClient, 'You are a helpful assistant'),
        new OutputStep(),
    ],
    context: $context
);

$result = $executor->execute();
```

## When to Use Modules

Create a module when:
- ✅ Complex multi-step workflows
- ✅ Need for internal orchestration
- ✅ Domain-specific logic that doesn't fit in Services
- ✅ Requires multiple handlers/steps
- ✅ Self-contained functionality

Don't create a module when:
- ❌ Simple CRUD operations (use Services)
- ❌ Single-step logic
- ❌ Just wrapping an external API (use Integrations)

## Naming

- **Module**: PascalCase, descriptive (`WorkflowEngine`, `PaymentProcessor`)
- **Executor**: `{Module}Executor`
- **Context**: `{Module}Context`
- **Steps**: Descriptive + `Step` suffix
- **Handlers**: Descriptive + `Handler` suffix

## Benefits

✅ **Separation of concerns** - Each step has one responsibility
✅ **Testable** - Mock individual steps/handlers
✅ **Extensible** - Add new steps without changing existing code
✅ **Reusable** - Steps can be composed in different workflows
✅ **Maintainable** - Clear structure for complex logic
